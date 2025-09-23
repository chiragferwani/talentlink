export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 md:flex-row">
        <p className="text-sm text-foreground/70">© {new Date().getFullYear()} TalentLink</p>
        <nav className="flex items-center gap-4">
          <a href="#features" className="text-sm text-foreground/80 hover:text-foreground">
            Features
          </a>
          <a href="#how" className="text-sm text-foreground/80 hover:text-foreground">
            How it works
          </a>
          <a href="/login" className="text-sm text-foreground/80 hover:text-foreground">
            Candidate Login
          </a>
        </nav>
      </div>
    </footer>
  )
}
