"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function CandidateLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/candidate/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code || undefined }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.message || "Login failed")
      }
      const data = await res.json()
      if (data?.id) {
        router.push(`/candidates/${data.id}`)
      } else {
        throw new Error("Candidate not found")
      }
    } catch (err: any) {
      toast({ title: "Login failed", description: err?.message || "Please try again.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-balance">Candidate Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Access Code (optional)</Label>
              <Input
                id="code"
                type="text"
                placeholder="Provided in your invite (if any)"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
              />
              <p className="text-xs text-muted-foreground">If you received a unique link, you can skip the code.</p>
            </div>
            <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            By continuing you agree to the communication policy shared in your invite.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
