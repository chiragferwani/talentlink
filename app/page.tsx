import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Inbox, Calendar, Shield, UserCheck, MessageSquare, Settings } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Main navigation">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-xl">
            <Image
              src="/tallogo.png"
              alt="TalentLink Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            TalentLink
            <span className="sr-only"> - go to homepage</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how" className="text-sm text-muted-foreground hover:text-foreground">
              How it works
            </Link>
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
              Company Login
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-primary text-primary-foreground">
                Candidate Login
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              Candidate-first communication
            </p>
            <h1 className="mt-4 text-pretty text-4xl font-bold leading-tight md:text-5xl">
              Keep every message, reply, and interview in one simple candidate portal
            </h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Email, SMS, and in‑app messages unified. Candidates log in, reply, and schedule with one click—while your
              team manages everything privately from the admin side.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/login">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  Enter Candidate Portal
                </Button>
              </Link>
              <Link href="#how" className="text-sm underline">
                See how it works
              </Link>
            </div>
          </div>

          {/* Right-side visuals */}
          <div className="grid w-full gap-3">
            <img
              src="/candidate-messaging-dashboard-ui.jpg"
              alt="Unified candidate messaging dashboard preview"
              className="w-full rounded-md border bg-card"
            />
            <div className="grid grid-cols-2 gap-3">
              <img
                src="/interview-scheduling-flow.jpg"
                alt="Scheduling confirmation flow"
                className="w-full rounded-md border bg-card"
              />
              <img
                src="/mobile-candidate-portal.jpg"
                alt="Mobile candidate portal view"
                className="w-full rounded-md border bg-card"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 pb-12 md:pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-sm font-semibold text-primary">Unified Inbox</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Email, SMS, and in‑app replies in one place. Candidates reply anywhere — you see everything together.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-sm font-semibold text-primary">1‑Click Scheduling</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Offer times and confirm instantly. Reschedule and reminders are built in.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-sm font-semibold text-primary">Private Admin</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Your team manages templates, audit logs, and escalations privately from the hidden{" "}
                <span className="font-mono">/admin</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 pb-16">
        <ol className="grid gap-4 md:grid-cols-3">
          <li className="rounded-md border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-sm font-semibold">1. Candidate logs in</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Simple email-based login to access messages and upcoming steps.
            </p>
          </li>
          <li className="rounded-md border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-sm font-semibold">2. Communicate & schedule</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Reply in one thread and confirm interviews without leaving the portal.
            </p>
          </li>
          <li className="rounded-md border p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-sm font-semibold">3. Team works in admin</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Recruiters manage templates, audit logs, and escalations privately.
            </p>
          </li>
        </ol>
        <div className="mt-10 flex items-center gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-primary text-primary-foreground">
              Candidate Login
            </Button>
          </Link>
          <Link href="/admin" className="text-sm underline">
            Company Login
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>© {new Date().getFullYear()} TalentLink. All rights reserved.</span>
            <Link href="/admin" className="hover:text-foreground">
              Company Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
