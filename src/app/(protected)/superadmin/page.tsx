"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, Users, Server, Activity, ArrowRight, Settings } from "lucide-react"
import Link from "next/link"

export default function SuperadminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Superadmin Dashboard</h1>
          <p className="text-muted-foreground">
            System overview, user management, and security logs.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" /> System Settings
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">176,846</div>
            <p className="text-xs text-green-500">100% PU Coverage</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitors</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground">Active now: 845</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Load</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">68%</div>
            <p className="text-xs text-muted-foreground">Normal operation</p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2M</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Audit Logs</CardTitle>
            <CardDescription>Security and administrative actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Force Result Approve</TableCell>
                  <TableCell>Admin_Kano</TableCell>
                  <TableCell>2m ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Account Suspended</TableCell>
                  <TableCell>System</TableCell>
                  <TableCell>15m ago</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Role Updated (Monitor)</TableCell>
                  <TableCell>SuperAdmin_Main</TableCell>
                  <TableCell>1h ago</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Link href="/superadmin/logs" className={buttonVariants({ variant: "ghost", className: "w-full mt-4" })}>
              View Full Audit Log <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Critical technical or security notices.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between p-3 border rounded-md bg-destructive/10">
              <div>
                <p className="text-sm font-bold text-destructive">Database Replica Lag</p>
                <p className="text-xs text-muted-foreground">Read replica region eu-west is lagging by 14s.</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>
            
            <div className="flex items-start justify-between p-3 border rounded-md bg-yellow-500/10">
              <div>
                <p className="text-sm font-bold text-yellow-600">High API Rate</p>
                <p className="text-xs text-muted-foreground">Public dashboard traffic spiked by 400%.</p>
              </div>
              <Badge variant="outline" className="text-yellow-600 border-yellow-500/50">Warning</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
