import { NextResponse } from "next/server"
import { listCandidates, createCandidate } from "@/lib/db"

export async function GET() {
  const candidates = listCandidates(false)
  return NextResponse.json({ candidates })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email || !body.role_title) {
      return NextResponse.json(
        { error: "Missing required fields: first_name, last_name, email, role_title" },
        { status: 400 }
      )
    }

    // Validate skills array
    if (!body.skills || !Array.isArray(body.skills) || body.skills.length === 0) {
      return NextResponse.json(
        { error: "Skills array is required and must not be empty" },
        { status: 400 }
      )
    }

    const candidate = await createCandidate({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone,
      location: body.location,
      linkedin_url: body.linkedin_url,
      role_title: body.role_title,
      resume_url: body.resume_url,
      portfolio_links: body.portfolio_links,
      certificates: body.certificates,
      skills: body.skills,
      notes: body.notes,
      stage: body.stage,
    })

    return NextResponse.json(candidate, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create candidate" },
      { status: 500 }
    )
  }
}
