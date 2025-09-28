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
log("template", `Seeded ${[t1, t2, t3].length} templates`)

// Seed candidate
const c1: Candidate = {
  id: "cand_001",
  first_name: "Akash",
  last_name: "Pandit",
  email: "akash.pandit@example.com",
  phone: "+1 555-0100",
  location: "San Francisco, CA",
  linkedin_url: "https://linkedin.com/in/akashpandit",
  role_title: "Senior Frontend Engineer",
  resume_url: "/resume-placeholder.jpg",
  portfolio_links: ["https://akashpandit.dev", "https://github.com/akashpandit"],
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
log("candidate", `Seeded candidate ${c1.first_name} ${c1.last_name} (${c1.id})`)

// Add some sample messages and interviews to the candidate
const sampleMessages = [
  {
    id: "msg_001",
    candidateId: c1.id,
    channel: "email" as Channel,
    templateId: "tmpl_invite",
    subject: "Welcome to TalentLink!",
    content: "Hi Akash, welcome to our hiring process for the Senior Frontend Engineer position. We're excited to have you as a candidate!",
    createdAt: "2024-01-10T10:00:00Z",
    sentiment: "positive" as const,
    escalated: false
  },
  {
    id: "msg_002", 
    candidateId: c1.id,
    channel: "sms" as Channel,
    subject: "Interview Reminder",
    content: "Hi Akash! Just a friendly reminder about your technical interview tomorrow at 2 PM. The meeting link is in your email. Good luck!",
    createdAt: "2024-01-14T16:00:00Z",
    sentiment: "positive" as const,
    escalated: false
  },
  {
    id: "msg_003",
    candidateId: c1.id,
    channel: "linkedin" as Channel,
    subject: "Great to connect!",
    content: "Akash, it was great meeting you during the screening call. Looking forward to the next steps in the process!",
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
log("send", `Seeded ${sampleMessages.length} messages for ${c1.id}`)
log("schedule", `Seeded 1 interview for ${c1.id}`, { candidateId: c1.id })

// Seed additional Indian candidates
const c2: Candidate = {
  id: "cand_002",
  first_name: "Priya",
  last_name: "Sharma",
  email: "priya.sharma@example.com",
  phone: "+91 98765 43210",
  location: "Mumbai, India",
  linkedin_url: "https://linkedin.com/in/priya-sharma",
  role_title: "Backend Engineer",
  resume_url: undefined,
  portfolio_links: ["https://github.com/priya-sharma"],
  certificates: ["Oracle Certified Professional"],
  skills: ["Node.js", "Express", "PostgreSQL", "Docker"],
  notes: "Strong in API design and databases.",
  public_feedback: "Solid backend fundamentals.",
  stage: "Applied",
  timeline: [],
  messages: [],
  gdpr_consent: true,
  data_retention_consent: true,
  createdAt: iso(),
  updatedAt: iso(),
  deletedAt: null,
}
const c3: Candidate = {
  id: "cand_003",
  first_name: "Rahul",
  last_name: "Mehta",
  email: "rahul.mehta@example.com",
  phone: "+91 99887 77665",
  location: "Bengaluru, India",
  linkedin_url: "https://linkedin.com/in/rahul-mehta",
  role_title: "Full Stack Developer",
  resume_url: undefined,
  portfolio_links: ["https://rahul.dev"],
  certificates: ["AWS Practitioner"],
  skills: ["React", "TypeScript", "Node.js", "AWS"],
  notes: "Great communicator.",
  public_feedback: "Good ownership and velocity.",
  stage: "Screening",
  timeline: [],
  messages: [],
  gdpr_consent: true,
  data_retention_consent: true,
  createdAt: iso(),
  updatedAt: iso(),
  deletedAt: null,
}
const c4: Candidate = {
  id: "cand_004",
  first_name: "Aditi",
  last_name: "Verma",
  email: "aditi.verma@example.com",
  phone: "+91 91234 56780",
  location: "Delhi, India",
  linkedin_url: "https://linkedin.com/in/aditi-verma",
  role_title: "Product Designer",
  resume_url: undefined,
  portfolio_links: ["https://aditiverma.design"],
  certificates: ["Google UX"],
  skills: ["Figma", "Prototyping", "User Research"],
  notes: "Excellent UX case studies.",
  public_feedback: "Strong product sense.",
  stage: "Interview",
  timeline: [],
  messages: [],
  gdpr_consent: true,
  data_retention_consent: true,
  createdAt: iso(),
  updatedAt: iso(),
  deletedAt: null,
}
const c5: Candidate = {
  id: "cand_005",
  first_name: "Arjun",
  last_name: "Iyer",
  email: "arjun.iyer@example.com",
  phone: "+91 90000 11122",
  location: "Chennai, India",
  linkedin_url: "https://linkedin.com/in/arjun-iyer",
  role_title: "Data Engineer",
  resume_url: undefined,
  portfolio_links: ["https://github.com/arjun-iyer"],
  certificates: ["Databricks", "GCP Data Engineer"],
  skills: ["Python", "Spark", "Airflow", "BigQuery"],
  notes: "Great with pipelines.",
  public_feedback: "Data modeling expertise.",
  stage: "Screening",
  timeline: [],
  messages: [],
  gdpr_consent: true,
  data_retention_consent: true,
  createdAt: iso(),
  updatedAt: iso(),
  deletedAt: null,
}
const c6: Candidate = {
  id: "cand_006",
  first_name: "Neha",
  last_name: "Kapoor",
  email: "neha.kapoor@example.com",
  phone: "+91 90909 80807",
  location: "Pune, India",
  linkedin_url: "https://linkedin.com/in/neha-kapoor",
  role_title: "QA Engineer",
  resume_url: undefined,
  portfolio_links: [],
  certificates: ["ISTQB"],
  skills: ["Cypress", "Playwright", "API Testing"],
  notes: "Automation heavy.",
  public_feedback: "Thorough test strategies.",
  stage: "Applied",
  timeline: [],
  messages: [],
  gdpr_consent: true,
  data_retention_consent: true,
  createdAt: iso(),
  updatedAt: iso(),
  deletedAt: null,
}

candidates.set(c2.id, c2)
candidates.set(c3.id, c3)
candidates.set(c4.id, c4)
candidates.set(c5.id, c5)
candidates.set(c6.id, c6)
log("candidate", "Seeded additional sample candidates: Priya, Rahul, Aditi, Arjun, Neha")

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
