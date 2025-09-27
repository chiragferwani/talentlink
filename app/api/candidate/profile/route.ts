import { NextResponse } from "next/server"
import { getCandidate } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const candidateId = searchParams.get('id')
    
    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 })
    }

    const candidate = getCandidate(candidateId)
    
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Remove sensitive internal notes from public response
    const publicCandidate = {
      ...candidate,
      notes: undefined // Hide internal notes from candidate view
    }

    return NextResponse.json(publicCandidate)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const candidateId = searchParams.get('id')
    
    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 })
    }

    const updates = await req.json()
    const candidate = getCandidate(candidateId)
    
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Only allow candidates to update certain fields
    const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'location', 'linkedin_url', 'skills', 'portfolio_links', 'certificates', 'gdpr_consent', 'data_retention_consent']
    const filteredUpdates: any = {}
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field]
      }
    }

    // Update candidate data
    Object.assign(candidate, filteredUpdates, { updatedAt: new Date().toISOString() })

    const publicCandidate = {
      ...candidate,
      notes: undefined
    }

    return NextResponse.json(publicCandidate)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const updates = await req.json()
    const candidateId = updates.id
    
    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 })
    }

    const candidate = getCandidate(candidateId)
    
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Only allow candidates to update certain fields
    const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'location', 'linkedin_url', 'skills', 'portfolio_links', 'certificates', 'gdpr_consent', 'data_retention_consent']
    const filteredUpdates: any = {}
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field]
      }
    }

    // Update candidate data
    Object.assign(candidate, filteredUpdates, { updatedAt: new Date().toISOString() })

    const publicCandidate = {
      ...candidate,
      notes: undefined
    }

    return NextResponse.json(publicCandidate)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
