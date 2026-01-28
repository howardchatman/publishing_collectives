import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  // Only protect /dashboard routes
  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Check for Supabase auth token in cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Get the access token from cookies (Supabase stores it here)
  const accessToken = request.cookies.get("sb-llwusclyblhvdnjzgerv-auth-token");

  if (!accessToken?.value) {
    // No token — redirect to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the token by calling Supabase
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${JSON.parse(accessToken.value)[0]}`,
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    // Must be logged in AND be Ecko's admin account
    const ADMIN_EMAILS = ["es@publishingcollectives.com"];

    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
