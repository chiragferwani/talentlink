import { NextResponse } from "next/server"
import { sendMessages, getCandidate } from "@/lib/db"
import type { Channel } from "@/lib/types"

const WEB3FORMS_API_KEY = process.env.WEB3FORMS_API_KEY || "0c41feef-74d7-4ee5-b2a2-4237c3ab5fc1"
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit"

async function sendEmailViaWeb3Forms(to: string, subject: string, body: string, fromName: string = "TalentLink") {
  try {
    const formData = new FormData()
    formData.append("access_key", WEB3FORMS_API_KEY)
    formData.append("subject", subject)
    formData.append("from_name", fromName)
    formData.append("to", to)
    formData.append("message", body)
    formData.append("replyto", "recruiter@talentlink.com")

    console.log("Sending email via web3forms:", { to, subject, fromName })

    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      body: formData,
    })

    const result = await response.json()
    console.log("Web3Forms response:", result)
    
    if (result.success) {
      return { 
        success: true, 
        messageId: result.messageId || result.data?.messageId || "web3forms-" + Date.now(),
        web3formsResponse: result
      }
    } else {
      throw new Error(result.message || "Failed to send email")
    }
  } catch (error) {
    console.error("Web3Forms email error:", error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const { candidateId, templateId, channels, subject, body, vars } = await req.json()
    if (!candidateId || !Array.isArray(channels) || channels.length === 0) {
      return NextResponse.json({ error: "candidateId and channels[] required" }, { status: 400 })
    }

    // Get candidate details for email sending
    const candidate = getCandidate(candidateId)
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
    }

    // Generate messages using existing logic
    const msgs = sendMessages({
      candidateId,
      templateId,
      subject,
      body,
      channels: channels as Channel[],
      vars: vars || {},
    })
    
    if (!msgs) return NextResponse.json({ error: "Failed to generate messages" }, { status: 500 })

    // Send actual emails via web3forms if email channel is selected
    const emailResults = []
    if (channels.includes("email") && candidate.email) {
      try {
        const emailMsg = msgs.find(msg => msg.channel === "email")
        if (emailMsg) {
          const emailResult = await sendEmailViaWeb3Forms(
            candidate.email,
            emailMsg.subject || "Message from TalentLink",
            emailMsg.content,
            "TalentLink Team"
          )
          emailResults.push({
            channel: "email",
            success: true,
            messageId: emailResult.messageId,
            recipient: candidate.email
          })
        }
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        emailResults.push({
          channel: "email",
          success: false,
          error: emailError instanceof Error ? emailError.message : "Unknown error",
          recipient: candidate.email
        })
      }
    }

    // For other channels (SMS, WhatsApp, LinkedIn), we'll just log them for now
    const otherChannels = channels.filter(ch => ch !== "email")
    const otherResults = otherChannels.map(channel => ({
      channel,
      success: true,
      message: "Message logged (external service integration needed)",
      recipient: channel === "sms" ? candidate.phone : 
                 channel === "whatsapp" ? candidate.phone :
                 channel === "linkedin" ? candidate.linkedin_url : "N/A"
    }))

    const allResults = [...emailResults, ...otherResults]

    return NextResponse.json({ 
      messages: msgs,
      deliveryResults: allResults,
      summary: {
        total: allResults.length,
        successful: allResults.filter(r => r.success).length,
        failed: allResults.filter(r => !r.success).length
      }
    })
  } catch (e: any) {
    console.error("Send message error:", e)
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}
