import { NextResponse } from "next/server"
import { scheduleInterview } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { candidateId, title, start, end, stakeholders, link } = await req.json()
    if (!candidateId || !title || !start || !end || !Array.isArray(stakeholders)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const event = scheduleInterview({ candidateId, title, start, end, stakeholders, link })
    if (!event) return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    return NextResponse.json({ event })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
