"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full border-b border-border bg-background">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="font-sans text-lg font-semibold text-foreground">
          TalentLink
        </Link>

        <button
          aria-label="Toggle menu"
          className="md:hidden rounded-md border border-border px-3 py-2 text-sm text-foreground"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <div className={cn("hidden items-center gap-6 md:flex")}>
          <a href="#features" className="text-sm text-foreground/80 hover:text-foreground">
            Features
          </a>
          <a href="#how" className="text-sm text-foreground/80 hover:text-foreground">
            How it works
          </a>
          <Link href="/login">
            <Button variant="default" className="text-sm">
              Candidate Login
            </Button>
          </Link>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3">
            <a href="#features" className="text-sm text-foreground/90" onClick={() => setOpen(false)}>
              Features
            </a>
            <a href="#how" className="text-sm text-foreground/90" onClick={() => setOpen(false)}>
              How it works
            </a>
            <Link href="/login" onClick={() => setOpen(false)} className="w-full">
              <Button variant="default" className="w-full text-sm">
                Candidate Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
