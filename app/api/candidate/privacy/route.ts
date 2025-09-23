import { NextResponse } from "next/server"
import { getCandidate, softDeleteCandidate, log } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { action, candidateId } = await req.json()
    
    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 })
    }

    const candidate = getCandidate(candidateId)
    
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    switch (action) {
      case 'download_data':
        // In a real implementation, generate and return candidate data export
        const exportData = {
          personal_info: {
            name: `${candidate.first_name} ${candidate.last_name}`,
            email: candidate.email,
            phone: candidate.phone,
            location: candidate.location,
            linkedin_url: candidate.linkedin_url
          },
          application_data: {
            role_title: candidate.role_title,
            skills: candidate.skills,
            stage: candidate.stage,
            created_at: candidate.createdAt,
            updated_at: candidate.updatedAt
          },
          communications: candidate.messages,
          interviews: candidate.timeline,
          documents: {
            resume_url: candidate.resume_url,
            portfolio_links: candidate.portfolio_links,
            certificates: candidate.certificates
          },
          consent: {
            gdpr_consent: candidate.gdpr_consent,
            data_retention_consent: candidate.data_retention_consent
          }
        }
        
        log("gdpr", `Data export requested for candidate ${candidateId}`, { candidateId })
        
        return NextResponse.json({
          message: "Data export prepared",
          data: exportData,
          export_date: new Date().toISOString()
        })

      case 'update_consent':
        const { gdpr_consent, data_retention_consent } = await req.json()
        
        if (gdpr_consent !== undefined) {
          candidate.gdpr_consent = gdpr_consent
        }
        if (data_retention_consent !== undefined) {
          candidate.data_retention_consent = data_retention_consent
        }
        
        candidate.updatedAt = new Date().toISOString()
        
        log("gdpr", `Consent updated for candidate ${candidateId}`, { 
          candidateId, 
          gdpr_consent, 
          data_retention_consent 
        })
        
        return NextResponse.json({
          message: "Consent preferences updated",
          gdpr_consent: candidate.gdpr_consent,
          data_retention_consent: candidate.data_retention_consent
        })

      case 'request_deletion':
        const deleted = softDeleteCandidate(candidateId)
        
        if (deleted) {
          return NextResponse.json({
            message: "Data deletion request processed. Your data has been marked for deletion and will be permanently removed within 30 days."
          })
        } else {
          return NextResponse.json({ error: "Failed to process deletion request" }, { status: 500 })
        }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
