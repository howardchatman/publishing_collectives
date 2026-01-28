import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    let title = "";
    let body = "";

    if (type === "lead") {
      title = "New Lead";
      body = `${data.first_name} ${data.last_name} (${data.email}) just joined the collective.`;
    } else if (type === "message") {
      title = "New Message";
      body = `${data.name || "A visitor"} (${data.email}) sent a message.`;
    }

    if (title) {
      await supabaseAdmin.from("notifications").insert({
        type,
        title,
        body,
        read: false,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
