"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminReportsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports Generation</h1>
        <p className="text-muted-foreground">Export state-level data and generate analytics reports.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Select a report to generate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">End of day collation report</p>
          <p className="text-sm">Incident frequency by LGA</p>
          <p className="text-sm">Agent turnout report</p>
        </CardContent>
      </Card>
    </div>
  )
}
