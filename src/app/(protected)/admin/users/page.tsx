"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">User Management (State Level)</h1>
        <p className="text-muted-foreground">Manage agents deployed within your jurisdiction.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Deployed Agents</CardTitle>
          <CardDescription>Akwa Ibom State agents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent ID</TableHead>
                <TableHead>Polling Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>AGT-AK-001</TableCell>
                <TableCell>PU 001, Ward 1</TableCell>
                <TableCell><Badge variant="default">Active</Badge></TableCell>
                <TableCell>...</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
