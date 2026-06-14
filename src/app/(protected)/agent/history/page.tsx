"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, Clock, FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const historyData = [
  { id: "SUB-001", type: "Presidential", time: "2027-02-27 14:30", status: "Verified" },
  { id: "SUB-002", type: "Senate", time: "2027-02-27 15:45", status: "Pending" },
]

export default function AgentHistoryPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Submission History</h1>
        <p className="text-muted-foreground">
          Track the status of your submitted election results and incident reports.
        </p>
      </div>

      <Card className="glass">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>All your activities across the polling unit</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search history..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission ID</TableHead>
                <TableHead>Election Type</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {item.id}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>
                    {item.status === "Verified" ? (
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-500/50 gap-1">
                        <Clock className="h-3 w-3" /> Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
