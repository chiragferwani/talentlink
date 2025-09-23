import { NextResponse } from "next/server"
import { softDeleteCandidate } from "@/lib/db"

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const ok = softDeleteCandidate(params.id)
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
