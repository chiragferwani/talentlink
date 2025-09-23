import { NextResponse } from "next/server"
import { getCandidate, log } from "@/lib/db"
import { analyzeSentiment } from "@/lib/sentiment"

function iso(d = new Date()) {
  return d.toISOString()
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { content } = await req.json()
    const cand = getCandidate(params.id)
    if (!cand) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const analysis = analyzeSentiment(String(content || ""))
    cand.messages.unshift({
      id: id("msg"),
      candidateId: cand.id,
      channel: "email",
      content: String(content || ""),
      createdAt: iso(),
      sentiment: analysis.sentiment,
      escalated: analysis.escalated,
    } as any)
    cand.updatedAt = iso()
    if (analysis.escalated) {
      log("send", `Escalation: negative reply from ${cand.id}`, { candidateId: cand.id })
    }
    return NextResponse.json({ ok: true, sentiment: analysis })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
