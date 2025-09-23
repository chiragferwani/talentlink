import { NextResponse } from "next/server"
import { listCandidates } from "@/lib/db"

export async function GET() {
  const candidates = listCandidates(false)
  return NextResponse.json({ candidates })
}
