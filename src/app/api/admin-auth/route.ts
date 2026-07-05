import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== getAdminPassword()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
