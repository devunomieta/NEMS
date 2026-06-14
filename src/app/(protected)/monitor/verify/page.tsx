"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, XCircle, Search, ZoomIn } from "lucide-react"
import { PARTIES } from "@/lib/constants"
import { toast } from "sonner"

export default function VerifyPage() {
  const [currentSubmission, setCurrentSubmission] = useState(1)
  const [isActioning, setIsActioning] = useState(false)

  const handleAction = (action: 'approve' | 'reject' | 'flag') => {
    setIsActioning(true)
    setTimeout(() => {
      setIsActioning(false)
      toast.success(`Submission ${action}ed successfully.`)
      setCurrentSubmission(prev => prev + 1)
    }, 1000)
  }

  // If no more submissions
  if (currentSubmission > 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <CheckCircle2 className="h-24 w-24 text-green-500" />
        <h2 className="text-2xl font-bold">Queue Empty</h2>
        <p className="text-muted-foreground">You have reviewed all pending submissions.</p>
        <Button onClick={() => window.location.href = '/monitor'}>Return to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verification Queue</h1>
          <p className="text-muted-foreground">
            Reviewing Submission #{1024 + currentSubmission} • PU 023, Enugu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">OCR Mismatch Detected</Badge>
          <span className="text-sm font-medium">1,245 Remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Evidence */}
        <Card className="glass h-full flex flex-col">
          <CardHeader>
            <CardTitle>Evidence Documents</CardTitle>
            <CardDescription>Compare entered data with uploaded EC8A form</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="relative aspect-[3/4] bg-muted rounded-md overflow-hidden border group">
              {/* Dummy EC8A image */}
              <img 
                src="https://images.unsplash.com/photo-1568205612837-017257d2310a?q=80&w=800&auto=format&fit=crop" 
                alt="Form EC8A"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white p-2 text-xs text-center">
                Form EC8A Snapshot • Uploaded 12m ago
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Data Comparison */}
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle>Data Comparison</CardTitle>
              <CardDescription>Agent Entry vs Automated OCR Extraction</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field / Party</TableHead>
                    <TableHead>Agent Entry</TableHead>
                    <TableHead>OCR Detected</TableHead>
                    <TableHead>Match</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Total Accredited</TableCell>
                    <TableCell>452</TableCell>
                    <TableCell>452</TableCell>
                    <TableCell><CheckCircle2 className="text-green-500 h-4 w-4" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Valid Votes</TableCell>
                    <TableCell>430</TableCell>
                    <TableCell>430</TableCell>
                    <TableCell><CheckCircle2 className="text-green-500 h-4 w-4" /></TableCell>
                  </TableRow>
                  {PARTIES.map((party, i) => {
                    const isMismatch = party.id === 'pdp' // simulate one mismatch
                    return (
                      <TableRow key={party.id} className={isMismatch ? "bg-red-500/10" : ""}>
                        <TableCell className="font-medium">{party.name}</TableCell>
                        <TableCell>{120 - i * 15}</TableCell>
                        <TableCell className={isMismatch ? "text-destructive font-bold" : ""}>
                          {isMismatch ? 170 : 120 - i * 15}
                        </TableCell>
                        <TableCell>
                          {isMismatch ? (
                            <XCircle className="text-destructive h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="text-green-500 h-4 w-4" />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="glass border-primary">
            <CardHeader>
              <CardTitle>Verification Decision</CardTitle>
              <CardDescription>Select action based on evidence review.</CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleAction('reject')}
                disabled={isActioning}
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject Data
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
                onClick={() => handleAction('flag')}
                disabled={isActioning}
              >
                <AlertCircle className="mr-2 h-4 w-4" /> Flag for Review
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleAction('approve')}
                disabled={isActioning}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Result
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
