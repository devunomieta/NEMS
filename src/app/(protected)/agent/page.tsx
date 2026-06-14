"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Video, FileText, Activity } from "lucide-react"
import Link from "next/link"

export default function AgentDashboard() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. You are assigned to <strong className="text-foreground">PU 045, Kano</strong>.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Online</div>
            <p className="text-xs text-muted-foreground">Connected to NEMS Server</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Pending verification</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/agent/submit" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <Card className="hover:bg-muted/50 transition-colors border-primary/20 cursor-pointer h-full">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Submit Election Results</CardTitle>
              <CardDescription>
                Enter vote counts and upload form EC8A and BVAS screenshots.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        
        <Link href="/agent/incident" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
          <Card className="hover:bg-muted/50 transition-colors border-primary/20 cursor-pointer h-full">
            <CardHeader>
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                <Video className="h-5 w-5 text-destructive" />
              </div>
              <CardTitle>Report Incident & Go Live</CardTitle>
              <CardDescription>
                Report disruptions or stream live video from your polling unit.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
