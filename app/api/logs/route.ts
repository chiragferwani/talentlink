import { NextResponse } from "next/server"
import { getAudits } from "@/lib/db"

export async function GET() {
  return NextResponse.json({ logs: getAudits() })
}
