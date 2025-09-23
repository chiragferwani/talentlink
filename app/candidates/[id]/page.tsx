import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

async function getCandidate(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL : ""}/api/candidate/${id}`,
    { cache: "no-store" },
  )
  if (!res.ok) return undefined
  return res.json()
}

export default async function CandidatePage({ params }: { params: { id: string } }) {
  const cand = await getCandidate(params.id)
  if (!cand) {
    return (
      <main className="container mx-auto p-6">
        <p>Candidate not found.</p>
      </main>
    )
  }
  return (
    <main className="container mx-auto p-6 grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-pretty">
          {cand.first_name} {cand.last_name}
        </h1>
        <p className="text-muted-foreground">
          {cand.role_title} • {cand.email}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="secondary">{cand.stage}</Badge>
          {cand.skills?.slice(0, 6)?.map((s: string) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-pretty">Message History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cand.messages?.length ? (
              cand.messages.map((m: any) => (
                <div key={m.id} className="border rounded p-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="uppercase">{m.channel}</span>
                      {m.sentiment ? <span>• {m.sentiment}</span> : null}
                      {m.escalated ? <span className="text-destructive">• escalated</span> : null}
                    </div>
                    <time>{new Date(m.createdAt).toLocaleString()}</time>
                  </div>
                  {m.subject ? <p className="font-medium mt-1">{m.subject}</p> : null}
                  <p className="whitespace-pre-wrap mt-1">{m.content}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No messages yet.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-pretty">Recruiter Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{cand.notes || "No notes."}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-pretty">Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded border bg-muted/30 p-3">
                <p className="text-sm text-muted-foreground">Resume link:</p>
                <a
                  className="underline hover:no-underline break-all"
                  href={cand.resume_url || "#"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open resume
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">Interview Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cand.timeline?.length ? (
            cand.timeline.map((ev: any) => (
              <div key={ev.id}>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{ev.title}</p>
                  <time className="text-sm text-muted-foreground">
                    {new Date(ev.start).toLocaleString()} — {new Date(ev.end).toLocaleString()}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">Stakeholders: {ev.stakeholders?.join(", ")}</p>
                {ev.link ? (
                  <a className="text-sm underline hover:no-underline" href={ev.link} target="_blank" rel="noreferrer">
                    Meeting link
                  </a>
                ) : null}
                <Separator className="my-3" />
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No events scheduled.</p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
