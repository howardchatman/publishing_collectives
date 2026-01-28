import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  // Only protect /dashboard routes
  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Find any Supabase auth cookie
  const allCookies = request.cookies.getAll();
  const authCookie = allCookies.find((c) => c.name.includes("auth-token"));

  if (!authCookie?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Try to extract the access token from the cookie value
    let accessToken: string;
    try {
      // Supabase stores as base64-encoded JSON array: ["access_token", "refresh_token"]
      const parsed = JSON.parse(
        Buffer.from(authCookie.value, "base64").toString("utf-8")
      );
      accessToken = Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      // Fallback: try parsing as plain JSON
      try {
        const parsed = JSON.parse(authCookie.value);
        accessToken = Array.isArray(parsed) ? parsed[0] : parsed;
      } catch {
        // Last fallback: use raw value
        accessToken = authCookie.value;
      }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const ADMIN_EMAILS = ["es@publishingcollectives.com"];

    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
