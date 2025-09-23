import { NextResponse } from "next/server"
import { getCandidate } from "@/lib/db"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const cand = getCandidate(params.id)
  if (!cand) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(cand)
}
