import type { Candidate, Template, Message, InterviewEvent, AuditLog, Channel } from "./types"
import { renderTemplate } from "./template-engine"
import { analyzeSentiment } from "./sentiment"

function iso(d = new Date()) {
  return d.toISOString()
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`
}

const candidates = new Map<string, Candidate>()
const templates = new Map<string, Template>()
const audits: AuditLog[] = []

// Seed templates
const t1: Template = {
  id: "tmpl_invite",
  name: "Interview Invite",
  subject: "Interview for {{role_title}}",
  body: "Hi {{first_name}},\n\nWe'd love to invite you to interview for {{role_title}}.\nInterviewers: {{interviewer_names}}\nPlease use this link to book a time: {{interview_link}}\n\nBest,\nTalentLink Team",
  updatedAt: iso(),
}
const t2: Template = {
  id: "tmpl_reject",
  name: "Rejection (Empathetic)",
  subject: "Update on your application for {{role_title}}",
  body: "Hi {{first_name}},\n\nThank you for taking the time to interview with us. After careful consideration, we won’t be moving forward.\nWe truly appreciate your interest.{{feedback}}\n\nWishing you the best,\nTalentLink Team",
  updatedAt: iso(),
}
const t3: Template = {
  id: "tmpl_status",
  name: "Status Update",
  subject: "Your application status: {{stage}}",
  body: 'Hi {{first_name}},\n\nA quick update: your application is now at the "{{stage}}" stage. We’ll keep you posted on the next steps.\n\nThanks,\nTalentLink',
  updatedAt: iso(),
}
templates.set(t1.id, t1)
templates.set(t2.id, t2)
templates.set(t3.id, t3)

// Seed candidate
const c1: Candidate = {
  id: "cand_001",
  first_name: "Alex",
  last_name: "Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 555-0100",
  location: "San Francisco, CA",
  linkedin_url: "https://linkedin.com/in/alexjohnson",
  role_title: "Senior Frontend Engineer",
  resume_url: "/resume-placeholder.jpg",
  portfolio_links: ["https://alexjohnson.dev", "https://github.com/alexjohnson"],
  certificates: ["AWS Certified Developer", "React Professional Certificate"],
  skills: ["React", "TypeScript", "Next.js", "Accessibility", "Testing"],
  notes: "Strong UI/UX sensibility. Good communication.",
  public_feedback: "Excellent technical skills and great cultural fit. Looking forward to next steps.",
  stage: "Screening",
  timeline: [],
  messages: [],
  gdpr_consent: true,
  data_retention_consent: true,
  createdAt: iso(),
  updatedAt: iso(),
  deletedAt: null,
}
candidates.set(c1.id, c1)

// Add some sample messages and interviews to the candidate
const sampleMessages = [
  {
    id: "msg_001",
    candidateId: c1.id,
    channel: "email" as Channel,
    templateId: "tmpl_invite",
    subject: "Welcome to TalentLink!",
    content: "Hi Alex, welcome to our hiring process for the Senior Frontend Engineer position. We're excited to have you as a candidate!",
    createdAt: "2024-01-10T10:00:00Z",
    sentiment: "positive" as const,
    escalated: false
  },
  {
    id: "msg_002", 
    candidateId: c1.id,
    channel: "sms" as Channel,
    subject: "Interview Reminder",
    content: "Hi Alex! Just a friendly reminder about your technical interview tomorrow at 2 PM. The meeting link is in your email. Good luck!",
    createdAt: "2024-01-14T16:00:00Z",
    sentiment: "positive" as const,
    escalated: false
  },
  {
    id: "msg_003",
    candidateId: c1.id,
    channel: "linkedin" as Channel,
    subject: "Great to connect!",
    content: "Alex, it was great meeting you during the screening call. Looking forward to the next steps in the process!",
    createdAt: "2024-01-12T14:30:00Z",
    sentiment: "positive" as const,
    escalated: false
  }
]

const sampleInterview = {
  id: "evt_001",
  candidateId: c1.id,
  title: "Technical Interview - Frontend Skills",
  start: "2024-01-15T14:00:00Z",
  end: "2024-01-15T15:30:00Z",
  stakeholders: ["John Smith (Senior Engineer)", "Sarah Wilson (Engineering Manager)"],
  link: "https://meet.google.com/abc-def-ghi",
  createdAt: "2024-01-10T12:00:00Z"
}

c1.messages = sampleMessages
c1.timeline = [sampleInterview]
candidates.set(c1.id, c1)

export function listCandidates(includeDeleted = false): Candidate[] {
  return Array.from(candidates.values()).filter((c) => includeDeleted || !c.deletedAt)
}

export function getCandidate(id: string): Candidate | undefined {
  return candidates.get(id)
}

export function softDeleteCandidate(id: string): boolean {
  const c = candidates.get(id)
  if (!c) return false
  c.deletedAt = iso()
  c.updatedAt = iso()
  log("gdpr", `Soft-deleted candidate ${id}`, { candidateId: id })
  return true
}

export function listTemplates(): Template[] {
  return Array.from(templates.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export function upsertTemplate(
  input: Partial<Template> & { name: string; body: string; id?: string; subject?: string },
): Template {
  const existing = input.id ? templates.get(input.id) : undefined
  const record: Template = {
    id: existing?.id || id("tmpl"),
    name: input.name,
    body: input.body,
    subject: input.subject,
    updatedAt: iso(),
  }
  templates.set(record.id, record)
  log("template", `Upserted template ${record.id}`, { templateId: record.id })
  return record
}

export function scheduleInterview(params: {
  candidateId: string
  title: string
  start: string
  end: string
  stakeholders: string[]
  link?: string
}): InterviewEvent | undefined {
  const c = candidates.get(params.candidateId)
  if (!c) return
  const event: InterviewEvent = {
    id: id("evt"),
    candidateId: c.id,
    title: params.title,
    start: params.start,
    end: params.end,
    stakeholders: params.stakeholders,
    link: params.link || `https://cal.example.com/${id("meet")}`,
    createdAt: iso(),
  }
  c.timeline.unshift(event)
  c.updatedAt = iso()
  // Stage transition heuristic
  if (c.stage === "Applied") c.stage = "Screening"
  else if (c.stage === "Screening") c.stage = "Interview"
  log("schedule", `Scheduled interview for ${c.id}`, { candidateId: c.id, eventId: event.id })
  return event
}

export function sendMessages(params: {
  candidateId: string
  templateId?: string
  subject?: string
  body?: string
  channels: Channel[]
  vars?: Record<string, any>
}): Message[] | undefined {
  const c = candidates.get(params.candidateId)
  if (!c) return
  const tmpl = params.templateId ? templates.get(params.templateId) : undefined
  const variables = {
    ...c,
    candidate: c,
    stage: c.stage,
    interviewer_names: params.vars?.interviewer_names || "TBD",
    interview_link: params.vars?.interview_link || "https://cal.example.com/book",
    feedback: params.vars?.feedback ? `\n\nFeedback: ${params.vars.feedback}` : "",
    ...params.vars,
  }
  const contentBase =
    (params.body ? renderTemplate(params.body, variables) : "") || (tmpl ? renderTemplate(tmpl.body, variables) : "")
  const subject = (params.subject ? renderTemplate(params.subject, variables) : "") || tmpl?.subject || ""

  const outs: Message[] = params.channels.map((ch) => {
    const analysis = analyzeSentiment(contentBase)
    return {
      id: id("msg"),
      candidateId: c.id,
      channel: ch,
      templateId: tmpl?.id,
      subject,
      content: contentBase,
      createdAt: iso(),
      sentiment: analysis.sentiment,
      escalated: analysis.escalated,
    }
  })
  c.messages.unshift(...outs)
  c.updatedAt = iso()
  log("send", `Sent ${outs.length} message(s) to ${c.id}`, {
    candidateId: c.id,
    channels: params.channels,
    templateId: tmpl?.id,
  })
  return outs
}

export function getAudits(): AuditLog[] {
  return audits.slice(0, 200)
}

export function log(type: AuditLog["type"], message: string, meta?: Record<string, any>) {
  audits.unshift({ id: id("log"), type, message, meta, createdAt: iso() })
}

// Prototype admin auth - returns token when valid
export function adminLogin(email: string, password: string): { ok: boolean; token?: string; error?: string } {
  const ok = email === "abc@gmail.com" && password === "admin123"
  if (ok) {
    const token = id("admin")
    log("auth", `Admin login success for ${email}`, { email })
    return { ok: true, token }
  }
  log("auth", `Admin login failed for ${email}`, { email })
  return { ok: false, error: "Invalid credentials" }
}
