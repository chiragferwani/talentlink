import { Card, CardContent } from "@/components/ui/card"

export function FeatureCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="text-sm font-semibold text-primary">Unified Threads</div>
          <p className="mt-2 text-sm text-muted-foreground">Email, SMS, and portal messages in one conversation.</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm font-semibold text-primary">Schedule Fast</div>
          <p className="mt-2 text-sm text-muted-foreground">Pick a time without back-and-forth emails.</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm font-semibold text-primary">Private Admin</div>
          <p className="mt-2 text-sm text-muted-foreground">Your team uses /admin — candidates won’t see it.</p>
        </CardContent>
      </Card>
    </div>
  )
}
