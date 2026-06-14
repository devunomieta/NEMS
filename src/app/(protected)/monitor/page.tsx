"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertTriangle, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function MonitorDashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Control Room</h1>
        <p className="text-muted-foreground">
          Real-time oversight of election submissions and verifications.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">1,245</div>
            <p className="text-xs text-muted-foreground">+32 in the last hour</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Results</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">45,102</div>
            <p className="text-xs text-muted-foreground">98% verification rate</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Submissions</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">89</div>
            <p className="text-xs text-muted-foreground">Requires admin review</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">42</div>
            <p className="text-xs text-muted-foreground">12 high severity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
            <CardDescription>
              Prioritized list of tasks requiring monitor action.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md bg-yellow-500/10">
              <div className="flex items-center gap-3">
                <FileText className="text-yellow-500 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">PU 023, Enugu</p>
                  <p className="text-xs text-muted-foreground">OCR mismatch detected</p>
                </div>
              </div>
              <Link href="/monitor/verify" className={buttonVariants({ size: "sm", variant: "outline" })}>Review</Link>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-md bg-destructive/10">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-destructive h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">PU 112, Rivers</p>
                  <p className="text-xs text-muted-foreground">Multiple submissions from same PU</p>
                </div>
              </div>
              <Link href="/monitor/verify" className={buttonVariants({ size: "sm", variant: "outline" })}>Review</Link>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card flex flex-col justify-center items-center text-center p-8">
          <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-xl font-bold mb-2">Verification Queue</h2>
          <p className="text-muted-foreground mb-6">
            There are currently 1,245 submissions waiting for manual verification or conflict resolution.
          </p>
          <Link href="/monitor/verify" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto" })}>
            Start Verification <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Card>
      </div>
    </div>
  )
}
