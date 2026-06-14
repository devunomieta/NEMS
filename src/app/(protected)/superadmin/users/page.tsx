"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function SuperadminUsersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Global User Management</h1>
        <p className="text-muted-foreground">Manage all system users, roles, and permissions.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>System-wide directory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">admin@nems.demo</TableCell>
                <TableCell><Badge variant="secondary">Admin</Badge></TableCell>
                <TableCell>Akwa Ibom State</TableCell>
                <TableCell><Badge variant="default">Active</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">monitor1@nems.demo</TableCell>
                <TableCell><Badge variant="outline">Monitor</Badge></TableCell>
                <TableCell>National</TableCell>
                <TableCell><Badge variant="default">Active</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
