import { NextResponse } from "next/server"
import { sendMessages } from "@/lib/db"
import type { Channel } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const { candidateId, templateId, channels, subject, body, vars } = await req.json()
    if (!candidateId || !Array.isArray(channels) || channels.length === 0) {
      return NextResponse.json({ error: "candidateId and channels[] required" }, { status: 400 })
    }
    const msgs = sendMessages({
      candidateId,
      templateId,
      subject,
      body,
      channels: channels as Channel[],
      vars: vars || {},
    })
    if (!msgs) return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    // Prototype: pretend external providers succeeded, return logs
    return NextResponse.json({ messages: msgs })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
