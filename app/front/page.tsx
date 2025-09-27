"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
      {children}
    </span>
  )
}

export default function FrontPage() {
  return (
    <main className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/front" className="font-semibold tracking-tight text-xl">
            TalentLink
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="default" className="bg-primary text-primary-foreground">
                Candidate Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <Pill>Modern hiring communication</Pill>
            <h1 className="mt-4 text-pretty text-4xl font-bold leading-tight md:text-5xl">
              Communicate with candidates clearly, quickly, and all in one place
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              TalentLink unifies email, SMS, and in-app messages. Candidates get a simple portal to reply, schedule, and
              stay on track — while your team quietly manages everything from the /admin side.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link href="/login">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  Candidate Login
                </Button>
              </Link>
              <Link href="/front#how-it-works" className="text-sm underline">
                How it works
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-md gap-3 md:max-w-lg">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Preview</div>
                <div className="mt-2 rounded-md border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Messages</div>
                    <span className="text-xs text-muted-foreground">Unified</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="rounded-md bg-secondary/80 p-3">
                      <div className="text-sm font-medium">Recruiter</div>
                      <div className="text-sm text-muted-foreground">Hi Akash — can we schedule a 30-min chat?</div>
                    </div>
                    <div className="rounded-md bg-accent/60 p-3">
                      <div className="text-sm font-medium">You</div>
                      <div className="text-sm text-muted-foreground">Tomorrow 10:30 works for me.</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-md border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Next step</div>
                    <span className="text-xs text-muted-foreground">Scheduling</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Choose a slot and you’re confirmed — no email back-and-forth.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-semibold text-primary">Unified Messages</div>
              <p className="mt-2 text-sm text-muted-foreground">
                See email, SMS, and in-app replies in one thread. Candidates reply anywhere — it all lands here.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-semibold text-primary">1-Click Scheduling</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Integrated scheduling removes friction. Confirm, reschedule, or cancel right in the portal.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-semibold text-primary">Private Admin</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your team quietly works from <span className="font-mono">/admin</span>. Candidates never see it.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-10">
          <Link href="/login">
            <Button size="lg" className="bg-primary text-primary-foreground">
              Enter Candidate Portal
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} TalentLink. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
