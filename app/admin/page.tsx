"use client"
import useSWR from "swr"
import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

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
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem("tl_admin_token")
    } catch {
      return null
    }
  })
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
  return { token, save, clear }
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
    <main className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-pretty">TalentLink Admin</h1>
        <Button variant="secondary" onClick={clear}>
          Sign out
        </Button>
      </div>
      <Tabs defaultValue="candidates" className="w-full">
        <TabsList>
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
    </main>
  )
}

function CandidatesTab() {
  const { data: list } = useSWR<{ candidates: Candidate[] }>(
    "/api/candidates", // we will provide this via a small handler below
    fetcher,
  )
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-pretty">Candidate List</CardTitle>
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
  )
}

function SendTab() {
  const { data: list } = useSWR<{ candidates: Candidate[] }>("/api/candidates", fetcher)
  const { data: tmpl } = useSWR<{ templates: Template[] }>("/api/templates", fetcher)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [templateId, setTemplateId] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)
  const [wa, setWa] = useState(false)
  const [li, setLi] = useState(false)

  const channels = useMemo(() => {
    const arr: string[] = []
    if (email) arr.push("email")
    if (sms) arr.push("sms")
    if (wa) arr.push("whatsapp")
    if (li) arr.push("linkedin")
    return arr
  }, [email, sms, wa, li])

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
        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Message Composer</CardTitle>
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
        <TemplatesHelp />
      </div>
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
  const { data: list } = useSWR<{ candidates: Candidate[] }>("/api/candidates", fetcher)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [title, setTitle] = useState("Interview")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [stakeholders, setStakeholders] = useState("recruiter@talentlink.com; hiring-manager@talentlink.com")

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
    } else {
      alert(data.error || "Failed")
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-pretty">Schedule Interview</CardTitle>
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
  )
}

function TemplatesTab() {
  const { data, mutate } = useSWR<{ templates: Template[] }>("/api/templates", fetcher)
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
      body: JSON.stringify({ name, subject: subject || undefined, body }),
    })
    if (res.ok) {
      await mutate()
      setName("")
      setSubject("")
      setBody("")
    } else {
      const d = await res.json()
      alert(d.error || "Failed to save")
    }
  }

  return (
    <div className="grid gap-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">New Template</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
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
          <Button onClick={onSave}>Save Template</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Existing Templates</CardTitle>
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
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-pretty">Audit Logs</CardTitle>
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
