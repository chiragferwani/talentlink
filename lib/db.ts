import type { Candidate, Template, Message, InterviewEvent, AuditLog, Channel } from "./types"
import { renderTemplate } from "./template-engine"
import { analyzeSentiment } from "./sentiment"
import { promises as fs } from "fs"
import path from "path"

function iso(d = new Date()) {
  return d.toISOString()
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`
}

// File-based persistence
const DATA_DIR = path.join(process.cwd(), "data")
const CANDIDATES_FILE = path.join(DATA_DIR, "candidates.json")
const TEMPLATES_FILE = path.join(DATA_DIR, "templates.json")
const AUDITS_FILE = path.join(DATA_DIR, "audits.json")

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Directory already exists or other error
  }
}

async function loadCandidates(): Promise<Map<string, Candidate>> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(CANDIDATES_FILE, "utf-8")
    const candidatesArray = JSON.parse(data)
    const map = new Map<string, Candidate>()
    candidatesArray.forEach((candidate: Candidate) => {
      map.set(candidate.id, candidate)
    })
    return map
  } catch (error) {
    // File doesn't exist or error reading, return empty map
    return new Map<string, Candidate>()
  }
}

async function saveCandidates(candidates: Map<string, Candidate>) {
  try {
    await ensureDataDir()
    const candidatesArray = Array.from(candidates.values())
    await fs.writeFile(CANDIDATES_FILE, JSON.stringify(candidatesArray, null, 2))
  } catch (error) {
    console.error("Error saving candidates:", error)
  }
}

async function loadTemplates(): Promise<Map<string, Template>> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(TEMPLATES_FILE, "utf-8")
    const templatesArray = JSON.parse(data)
    const map = new Map<string, Template>()
    templatesArray.forEach((template: Template) => {
      map.set(template.id, template)
    })
    return map
  } catch (error) {
    // File doesn't exist or error reading, return empty map
    return new Map<string, Template>()
  }
}

async function saveTemplates(templates: Map<string, Template>) {
  try {
    await ensureDataDir()
    const templatesArray = Array.from(templates.values())
    await fs.writeFile(TEMPLATES_FILE, JSON.stringify(templatesArray, null, 2))
  } catch (error) {
    console.error("Error saving templates:", error)
  }
}

async function loadAudits(): Promise<AuditLog[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(AUDITS_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist or error reading, return empty array
    return []
  }
}

async function saveAudits(audits: AuditLog[]) {
  try {
    await ensureDataDir()
    await fs.writeFile(AUDITS_FILE, JSON.stringify(audits, null, 2))
  } catch (error) {
    console.error("Error saving audits:", error)
  }
}

const candidates = new Map<string, Candidate>()
const templates = new Map<string, Template>()
const audits: AuditLog[] = []

// Initialize data from files on startup
async function initializeData() {
  try {
    const loadedCandidates = await loadCandidates()
    const loadedTemplates = await loadTemplates()
    const loadedAudits = await loadAudits()
    
    // Load existing data
    loadedCandidates.forEach((candidate, id) => candidates.set(id, candidate))
    loadedTemplates.forEach((template, id) => templates.set(id, template))
    audits.push(...loadedAudits)
    
    // If no data exists, seed with default data
    if (candidates.size === 0) {
      await seedCandidates()
    }
    if (templates.size === 0) {
      await seedTemplates()
    }
  } catch (error) {
    console.error("Error initializing data:", error)
    // Fallback to seeding if loading fails
    await seedCandidates()
    await seedTemplates()
  }
}

// Seed default candidates
async function seedCandidates() {
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
  
  // Add more seeded candidates...
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
  candidates.set(c2.id, c2)
  
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
  candidates.set(c3.id, c3)
  
  const c4: Candidate = {
    id: "cand_004",
    first_name: "Aditi",
    last_name: "Verma",
    email: "aditi.verma@example.com",
    phone: "+91 98765 12345",
    location: "Delhi, India",
    linkedin_url: "https://linkedin.com/in/aditi-verma",
    role_title: "Product Designer",
    resume_url: undefined,
    portfolio_links: ["https://aditidesigns.com"],
    certificates: ["Google UX Design Certificate"],
    skills: ["Figma", "Prototyping", "User Research"],
    notes: "Creative and user-focused.",
    public_feedback: "Great design thinking.",
    stage: "Interview",
    timeline: [],
    messages: [],
    gdpr_consent: true,
    data_retention_consent: true,
    createdAt: iso(),
    updatedAt: iso(),
    deletedAt: null,
  }
  candidates.set(c4.id, c4)
  
  const c5: Candidate = {
    id: "cand_005",
    first_name: "Arjun",
    last_name: "Iyer",
    email: "arjun.iyer@example.com",
    phone: "+91 99888 77666",
    location: "Chennai, India",
    linkedin_url: "https://linkedin.com/in/arjun-iyer",
    role_title: "Data Engineer",
    resume_url: undefined,
    portfolio_links: ["https://github.com/arjun-iyer"],
    certificates: ["AWS Data Analytics"],
    skills: ["Python", "Spark", "Airflow", "BigQuery"],
    notes: "Strong in data pipelines.",
    public_feedback: "Excellent data engineering skills.",
    stage: "Screening",
    timeline: [],
    messages: [],
    gdpr_consent: true,
    data_retention_consent: true,
    createdAt: iso(),
    updatedAt: iso(),
    deletedAt: null,
  }
  candidates.set(c5.id, c5)
  
  const c6: Candidate = {
    id: "cand_006",
    first_name: "Neha",
    last_name: "Kapoor",
    email: "neha.kapoor@example.com",
    phone: "+91 98765 54321",
    location: "Pune, India",
    linkedin_url: "https://linkedin.com/in/neha-kapoor",
    role_title: "QA Engineer",
    resume_url: undefined,
    portfolio_links: ["https://github.com/neha-kapoor"],
    certificates: ["ISTQB Certified"],
    skills: ["Cypress", "Playwright", "API Testing"],
    notes: "Detail-oriented and thorough.",
    public_feedback: "Great attention to quality.",
    stage: "Applied",
    timeline: [],
    messages: [],
    gdpr_consent: true,
    data_retention_consent: true,
    createdAt: iso(),
    updatedAt: iso(),
    deletedAt: null,
  }
  candidates.set(c6.id, c6)
  
  log("candidate", "Seeded additional sample candidates: Priya, Rahul, Aditi, Arjun, Neha")
  await saveCandidates(candidates)
}

// Seed default templates
async function seedTemplates() {
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
    body: "Hi {{first_name}},\n\nThank you for taking the time to interview with us. After careful consideration, we won't be moving forward.\nWe truly appreciate your interest.{{feedback}}\n\nWishing you the best,\nTalentLink Team",
    updatedAt: iso(),
  }
  const t3: Template = {
    id: "tmpl_status",
    name: "Status Update",
    subject: "Your application status: {{stage}}",
    body: `Hi {{first_name}},\n\nA quick update: your application is now at the "{{stage}}" stage. We'll keep you posted on the next steps.\n\nThanks,\nTalentLink`,
    updatedAt: iso(),
  }
  templates.set(t1.id, t1)
  templates.set(t2.id, t2)
  templates.set(t3.id, t3)
  log("template", `Seeded ${[t1, t2, t3].length} templates`)
  await saveTemplates(templates)
}

// Initialize data on module load
initializeData().catch(console.error)

export function listCandidates(includeDeleted = false): Candidate[] {
  return Array.from(candidates.values()).filter((c) => includeDeleted || !c.deletedAt)
}

export function getCandidate(id: string): Candidate | undefined {
  return candidates.get(id)
}

export async function createCandidate(input: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  location?: string
  linkedin_url?: string
  role_title: string
  resume_url?: string
  portfolio_links?: string[]
  certificates?: string[]
  skills: string[]
  notes?: string
  stage?: "Applied" | "Screening" | "Interview" | "Offer" | "Reject"
}): Promise<Candidate> {
  const candidate: Candidate = {
    id: id("cand"),
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email,
    phone: input.phone,
    location: input.location,
    linkedin_url: input.linkedin_url,
    role_title: input.role_title,
    resume_url: input.resume_url,
    portfolio_links: input.portfolio_links || [],
    certificates: input.certificates || [],
    skills: input.skills,
    notes: input.notes,
    public_feedback: undefined,
    stage: input.stage || "Applied",
    timeline: [],
    messages: [],
    gdpr_consent: true,
    data_retention_consent: true,
    createdAt: iso(),
    updatedAt: iso(),
    deletedAt: null,
  }
  
  candidates.set(candidate.id, candidate)
  log("candidate", `Created candidate ${candidate.first_name} ${candidate.last_name} (${candidate.id})`)
  
  // Save to file
  await saveCandidates(candidates)
  
  return candidate
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
