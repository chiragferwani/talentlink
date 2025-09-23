export function HowItWorks() {
  const steps = [
    { step: "1", title: "Invite & Login", body: "Candidates receive an invite and securely log in to view updates." },
    { step: "2", title: "Stay Informed", body: "Messages, schedules, and decisions appear in one clear timeline." },
    { step: "3", title: "Take Action", body: "Reply, confirm times, and upload info directly from the portal." },
  ]

  return (
    <section id="how" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="font-sans text-balance text-2xl font-semibold text-foreground md:text-3xl">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.step} className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm font-medium text-foreground/70">Step {s.step}</div>
              <h3 className="mt-1 font-sans text-lg font-medium text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
