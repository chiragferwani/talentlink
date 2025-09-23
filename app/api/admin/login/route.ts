import { NextResponse } from "next/server"
import { adminLogin } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    const res = adminLogin(email, password)
    if (!res.ok) return NextResponse.json({ error: res.error }, { status: 401 })
    // Prototype: return token (caller can store in localStorage)
    return NextResponse.json({ token: res.token, email })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
