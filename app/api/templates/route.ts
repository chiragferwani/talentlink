import { NextResponse } from "next/server"
import { listTemplates, upsertTemplate } from "@/lib/db"

export async function GET() {
  return NextResponse.json({ templates: listTemplates() })
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const t = upsertTemplate(payload)
    return NextResponse.json({ template: t })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Invalid payload" }, { status: 400 })
  }
}
