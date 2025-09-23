export type Channel = "email" | "sms" | "whatsapp" | "linkedin"

export type Message = {
  id: string
  candidateId: string
  channel: Channel
  templateId?: string
  subject?: string
  content: string
  createdAt: string
  meta?: Record<string, any>
  sentiment?: "positive" | "neutral" | "negative"
  escalated?: boolean
}

export type InterviewEvent = {
  id: string
  candidateId: string
  title: string
  start: string // ISO
  end: string // ISO
  stakeholders: string[]
  link?: string
  createdAt: string
}

export type Template = {
  id: string
  name: string
  subject?: string
  body: string
  updatedAt: string
}

export type Candidate = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role_title: string
  resume_url?: string
  skills: string[]
  notes?: string
  stage: "Applied" | "Screening" | "Interview" | "Offer" | "Reject"
  timeline: InterviewEvent[]
  messages: Message[]
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type AuditLog = {
  id: string
  type: "send" | "schedule" | "template" | "auth" | "gdpr"
  message: string
  createdAt: string
  meta?: Record<string, any>
}
