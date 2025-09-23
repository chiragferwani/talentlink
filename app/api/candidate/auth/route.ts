import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()
    if (!email || typeof email !== "string") {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    // Build base origin from request URL
    const origin = new URL(req.url).origin
    const res = await fetch(`${origin}/api/candidates`, { cache: "no-store" })
    if (!res.ok) {
      return NextResponse.json({ message: "Unable to load candidates" }, { status: 502 })
    }
    const raw = await res.json()
    const list = Array.isArray(raw) ? raw : Array.isArray(raw?.candidates) ? raw.candidates : []

    const normalizedEmail = email.trim().toLowerCase()
    const match = list.find((c: any) => {
      const cEmail = (c?.email || "").toLowerCase()
      // If an access code exists on the candidate, require exact match when a code is provided.
      if (code && c?.accessCode) {
        return cEmail === normalizedEmail && String(c.accessCode).trim() === String(code).trim()
      }
      return cEmail === normalizedEmail
    })

    if (!match?.id) {
      return NextResponse.json({ message: "Candidate not found" }, { status: 404 })
    }

    return NextResponse.json({ id: match.id })
  } catch (err) {
    return NextResponse.json({ message: "Unexpected error" }, { status: 500 })
  }
}
