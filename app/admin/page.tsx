"use client"
import useSWR from "swr"
import type React from "react"

import { useMemo, useState, useEffect } from "react"
import { mutate as globalMutate } from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, X } from "lucide-react"
import Image from "next/image"

type Candidate = {
  id: string
  first_name: string
  last_name: string
  email: string
  role_title: string
  stage: string
  skills: string[]
  messages: {
    id: string
    channel: string
    subject?: string
    content: string
    createdAt: string
    sentiment?: string
    escalated?: boolean
  }[]
  timeline: { id: string; title: string; start: string; end: string; stakeholders: string[]; link?: string }[]
}

type Template = { id: string; name: string; subject?: string; body: string }

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function useLocalToken() {
  const [token, setToken] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    try {
      setToken(localStorage.getItem("tl_admin_token"))
    } catch {
      // Ignore localStorage errors
    }
  }, [])
  
  const save = (t: string) => {
    setToken(t)
    try {
      localStorage.setItem("tl_admin_token", t)
    } catch {}
  }
  const clear = () => {
    setToken(null)
    try {
      localStorage.removeItem("tl_admin_token")
    } catch {}
  }
  return { token: isClient ? token : null, save, clear }
}

export default function AdminPage() {
  const { token, save, clear } = useLocalToken()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function onLogin(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/admin/login", { method: "POST", body: JSON.stringify({ email, password }) })
    const data = await res.json()
    if (res.ok) {
      save(data.token)
    } else {
      alert(data.error || "Login failed")
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <Card className="bg-background w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-pretty text-center">Company Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLogin} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Company Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@talentlink.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit">Sign in</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-700 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/tallogo.png" alt="TalentLink Logo" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="text-xl font-semibold text-white">Admin Console</h1>
              <p className="text-sm text-blue-100">Manage candidates, messages, and templates</p>
            </div>
          </div>
          <Button onClick={clear} className="bg-white/10 text-white hover:bg-white/20">Sign out</Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Tabs defaultValue="candidates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="send">Send Message</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          </TabsList>

        <TabsContent value="candidates">
          <CandidatesTab />
        </TabsContent>

        <TabsContent value="send">
          <SendTab />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleTab />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="logs">
          <LogsTab />
        </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

function CandidatesTab() {
  const { data: list, mutate } = useSWR<{ candidates: Candidate[] }>(
    "/api/candidates", // we will provide this via a small handler below
    fetcher,
  )
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin_url: "",
    role_title: "",
    skills: [] as string[],
    notes: "",
    stage: "Applied" as "Applied" | "Screening" | "Interview" | "Offer" | "Reject"
  })
  const [skillInput, setSkillInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Reset form
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          location: "",
          linkedin_url: "",
          role_title: "",
          skills: [],
          notes: "",
          stage: "Applied"
        })
        setIsAddDialogOpen(false)
        // Refresh all candidate data across all tabs
        await globalMutate("/api/candidates")
        alert("Candidate added successfully!")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add candidate")
      }
    } catch (error) {
      alert("Failed to add candidate")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-pretty text-emerald-800">Candidate List</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role_title">Role Title *</Label>
                    <Input
                      id="role_title"
                      value={formData.role_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, role_title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Select value={formData.stage} onValueChange={(value: "Applied" | "Screening" | "Interview" | "Offer" | "Reject") => setFormData(prev => ({ ...prev, stage: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Screening">Screening</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Reject">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Skills *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skills"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill} variant="outline">
                      Add
                    </Button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md text-sm">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-emerald-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Candidate"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list?.candidates?.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    {c.first_name} {c.last_name}
                  </TableCell>
                  <TableCell>{c.role_title}</TableCell>
                  <TableCell>{c.stage}</TableCell>
                  <TableCell className="max-w-[240px] truncate">{c.skills.join(", ")}</TableCell>
                  <TableCell>
                    <a className="underline hover:no-underline" href={`/candidates/${c.id}`}>
                      Open
                    </a>
                  </TableCell>
                </TableRow>
              )) || null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function SendTab() {
  const { data: list, mutate } = useSWR<{ candidates: Candidate[] }>("/api/candidates", fetcher)
  const { data: tmpl } = useSWR<{ templates: Template[] }>("/api/templates", fetcher)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)
  const [wa, setWa] = useState(false)
  const [li, setLi] = useState(false)
  const [previewMode, setPreviewMode] = useState<"email" | "sms">("email")

  const channels = useMemo(() => {
    const arr: string[] = []
    if (email) arr.push("email")
    if (sms) arr.push("sms")
    if (wa) arr.push("whatsapp")
    if (li) arr.push("linkedin")
    return arr
  }, [email, sms, wa, li])

  // Resolve current selections
  const selectedCandidate = useMemo(() => list?.candidates?.find((c) => c.id === candidateId) || null, [list, candidateId])
  const selectedTemplate = useMemo(() => tmpl?.templates?.find((t) => t.id === templateId) || null, [tmpl, templateId])

  // Pick upcoming interview (or last) for variables
  const interviewContext = useMemo(() => {
    if (!selectedCandidate) return null
    const now = new Date()
    const upcoming = [...(selectedCandidate.timeline || [])]
      .filter((e) => new Date(e.start) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0]
    if (upcoming) return upcoming
    // Fallback to most recent past
    const pastSorted = [...(selectedCandidate.timeline || [])].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
    return pastSorted[0] || null
  }, [selectedCandidate])

  // Variable substitution
  function renderTemplate(text: string | undefined): string {
    if (!text) return ""
    const vars: Record<string, string> = {
      first_name: selectedCandidate?.first_name || "Candidate",
      last_name: selectedCandidate?.last_name || "",
      role_title: selectedCandidate?.role_title || "",
      stage: selectedCandidate?.stage || "",
      interviewer_names: interviewContext?.stakeholders?.join(", ") || "",
      interview_link: interviewContext?.link || "",
      candidate_email: selectedCandidate?.email || "",
      company_email: "recruiter@talentlink.com",
      today: new Date().toLocaleDateString(),
    }
    return text.replace(/{{\s*(\w+)\s*}}/g, (_, key) => (key in vars ? vars[key] : ""))
  }

  const effectiveSubject = useMemo(() => {
    return renderTemplate(subject || selectedTemplate?.subject || "")
  }, [subject, selectedTemplate, selectedCandidate, interviewContext])

  const effectiveBody = useMemo(() => {
    return renderTemplate(body || selectedTemplate?.body || "")
  }, [body, selectedTemplate, selectedCandidate, interviewContext])

  async function onSend() {
    if (!candidateId || channels.length === 0) {
      alert("Select candidate and at least one channel.")
      return
    }
    const res = await fetch("/api/send", {
      method: "POST",
      body: JSON.stringify({
        candidateId,
        templateId,
        subject: subject || undefined,
        body: body || undefined,
        channels,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      alert(`Sent ${data.messages.length} message(s).`)
      setSubject("")
      setBody("")
    } else {
      alert(data.error || "Failed")
    }
  }

  return (
    <div className="grid gap-4 mt-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-pretty text-cyan-800">Message Composer</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Candidate</Label>
              <Select onValueChange={(v) => setCandidateId(v)} value={candidateId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {list?.candidates?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} — {c.role_title}
                    </SelectItem>
                  )) || null}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Template</Label>
              <Select onValueChange={(v) => setTemplateId(v)} value={templateId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Optional template" />
                </SelectTrigger>
                <SelectContent>
                  {tmpl?.templates?.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  )) || null}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Subject (optional)</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Overrides template subject"
              />
            </div>
            <div className="grid gap-2">
              <Label>Body (optional)</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                placeholder="Overrides template body; supports {{first_name}}, {{role_title}}, {{interview_link}}, {{interviewer_names}}"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <Switch checked={email} onCheckedChange={setEmail} /> <span>Email</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={sms} onCheckedChange={setSms} /> <span>SMS</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={wa} onCheckedChange={setWa} /> <span>WhatsApp</span>
              </label>
              <label className="flex items-center gap-2">
                <Switch checked={li} onCheckedChange={setLi} /> <span>LinkedIn</span>
              </label>
            </div>
            <Button onClick={onSend}>Send</Button>
          </CardContent>
        </Card>
        {/* Live Preview Panel */}
        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-pretty text-rose-800">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Mode toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`px-3 py-1 rounded-md text-sm border ${
                  previewMode === "email" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-foreground"
                }`}
                onClick={() => setPreviewMode("email")}
              >
                Email
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-md text-sm border ${
                  previewMode === "sms" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-foreground"
                }`}
                onClick={() => setPreviewMode("sms")}
              >
                SMS / WhatsApp
              </button>
            </div>

            {previewMode === "email" ? (
              <div className="rounded-md border bg-white/70">
                <div className="border-b p-3 text-sm">
                  <div className="flex gap-2"><span className="font-medium">From:</span><span>recruiter@talentlink.com</span></div>
                  <div className="flex gap-2"><span className="font-medium">To:</span><span>{selectedCandidate?.email || "-"}</span></div>
                  <div className="flex gap-2"><span className="font-medium">Subject:</span><span>{effectiveSubject || "(no subject)"}</span></div>
                </div>
                <div className="p-4 whitespace-pre-wrap text-sm leading-relaxed">
                  {effectiveBody || "Your message body will appear here. Select a candidate and/or template, or type your own subject/body."}
                </div>
              </div>
            ) : (
              <div className="rounded-md border bg-white/70 p-4 text-sm">
                <div className="mb-2">
                  <span className="font-medium">To:</span> {selectedCandidate?.first_name ? `${selectedCandidate.first_name} ${selectedCandidate.last_name}` : "-"}
                </div>
                <div className="rounded-lg bg-muted p-3 whitespace-pre-wrap">
                  {(
                    effectiveBody || effectiveSubject || "Your SMS content preview will appear here."
                  )}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Length: {(effectiveBody || effectiveSubject || "").length} chars</div>
              </div>
            )}

            {/* Context Hints */}
            <div className="text-xs text-muted-foreground">
              Supports variables: {"{{first_name}}"}, {"{{role_title}}"}, {"{{stage}}"}, {"{{interviewer_names}}"}, {"{{interview_link}}"}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Keep template help below */}
      <TemplatesHelp />
    </div>
  )
}

function TemplatesHelp() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Template Variables</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>
          Use variables like: {"{{first_name}}"}, {"{{role_title}}"}, {"{{stage}}"}, {"{{interviewer_names}}"},{" "}
          {"{{interview_link}}"}.
        </p>
        <p className="mt-2">Example subject: Interview for {"{{role_title}}"}</p>
        <p className="mt-2">
          Example body: Hi {"{{first_name}}"}, please pick a time: {"{{interview_link}}"}
        </p>
      </CardContent>
    </Card>
  )
}

function ScheduleTab() {
  const { data: list, mutate } = useSWR<{ candidates: Candidate[] }>("/api/candidates", fetcher)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [title, setTitle] = useState("Interview")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [stakeholders, setStakeholders] = useState("recruiter@talentlink.com; hiring-manager@talentlink.com")
  const selectedCandidate = useMemo(
    () => list?.candidates?.find((c) => c.id === candidateId) || null,
    [list, candidateId],
  )

  async function onSchedule() {
    if (!candidateId || !title || !start || !end) {
      alert("Fill all fields")
      return
    }
    const res = await fetch("/api/schedule", {
      method: "POST",
      body: JSON.stringify({
        candidateId,
        title,
        start,
        end,
        stakeholders: stakeholders
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    })
    const data = await res.json()
    if (res.ok) {
      alert(`Scheduled: ${data.event.title}`)
      // refresh candidate list so timeline updates
      await globalMutate("/api/candidates")
    } else {
      alert(data.error || "Failed")
    }
  }

  return (
    <div className="grid gap-6 mt-4">
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-pretty text-amber-800">Schedule Interview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Candidate</Label>
              <Select onValueChange={(v) => setCandidateId(v)} value={candidateId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {list?.candidates?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} — {c.role_title}
                    </SelectItem>
                  )) || null}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Start</Label>
              <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>End</Label>
              <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
            <div className="md:col-span-2 grid gap-2">
              <Label>Stakeholders (semicolon separated)</Label>
              <Input value={stakeholders} onChange={(e) => setStakeholders(e.target.value)} />
            </div>
          </div>
          <Button onClick={onSchedule}>Create Event</Button>
        </CardContent>
      </Card>

      {/* Scheduled Interviews Section */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-pretty text-indigo-800">Scheduled Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedCandidate ? (
            <div className="text-sm text-muted-foreground">Select a candidate to view their scheduled interviews.</div>
          ) : selectedCandidate.timeline && selectedCandidate.timeline.length > 0 ? (
            <div className="space-y-3">
              {[...selectedCandidate.timeline]
                .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
                .map((evt) => (
                  <div key={evt.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{evt.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(evt.start).toLocaleString()} — {new Date(evt.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <div className="text-xs text-muted-foreground">Interviewers: {evt.stakeholders.join(", ")}</div>
                        {evt.link ? (
                          <a href={evt.link} target="_blank" rel="noopener noreferrer" className="text-xs underline">
                            Join link
                          </a>
                        ) : null}
                      </div>
                      <span className="text-xs rounded bg-secondary px-2 py-1">{new Date(evt.start) > new Date() ? "Upcoming" : "Completed"}</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No interviews scheduled yet for {selectedCandidate.first_name}.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TemplatesTab() {
  const { data, mutate } = useSWR<{ templates: Template[] }>("/api/templates", fetcher)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  async function onSave() {
    if (!name || !body) {
      alert("Name and body required")
      return
    }
    const res = await fetch("/api/templates", {
      method: "POST",
      body: JSON.stringify({ id: editId || undefined, name, subject: subject || undefined, body }),
    })
    if (res.ok) {
      await globalMutate("/api/templates")
      // Clear only if it was a new template; for edits, keep in form
      if (!editId) {
        setName("")
        setSubject("")
        setBody("")
      }
    } else {
      const d = await res.json()
      alert(d.error || "Failed to save")
    }
  }

  return (
    <div className="grid gap-6 mt-4">
      <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-pretty text-violet-800">New Template</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Edit existing (optional)</Label>
            <Select
              value={editId || ""}
              onValueChange={(v) => {
                if (v === "__clear__" || v === "") {
                  setEditId(null)
                  setName("")
                  setSubject("")
                  setBody("")
                  return
                }
                setEditId(v)
                const t = data?.templates?.find((x) => x.id === v)
                if (t) {
                  setName(t.name)
                  setSubject(t.subject || "")
                  setBody(t.body)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template to edit" />
              </SelectTrigger>
              <SelectContent>
                {(data?.templates || []).map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
                <SelectItem value="__clear__">Clear selection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Body</Label>
            <Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onSave}>{editId ? "Update Template" : "Save Template"}</Button>
            {editId ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditId(null)
                  setName("")
                  setSubject("")
                  setBody("")
                }}
              >
                New Template
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-pretty text-blue-800">Existing Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.templates?.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{t.subject || "-"}</TableCell>
                  <TableCell>{/* we don't expose updatedAt in tab type to keep small */}-</TableCell>
                </TableRow>
              )) || null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function LogsTab() {
  const { data } = useSWR<{ logs: { id: string; type: string; message: string; createdAt: string }[] }>(
    "/api/logs",
    fetcher,
  )
  return (
    <Card className="mt-4 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-pretty text-slate-800">Audit Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.logs?.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{new Date(l.createdAt).toLocaleString()}</TableCell>
                <TableCell>{l.type}</TableCell>
                <TableCell className="max-w-[640px] truncate">{l.message}</TableCell>
              </TableRow>
            )) || null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
