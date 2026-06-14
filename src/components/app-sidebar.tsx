"use client"

import * as React from "react"
import { GalleryVerticalEnd, LayoutDashboard, Send, ShieldAlert, FileText, Settings, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


const navItems = {
  agent: [
    { title: "Dashboard", url: "/agent", icon: LayoutDashboard },
    { title: "Submit Results", url: "/agent/submit", icon: Send },
    { title: "Report Incident", url: "/agent/incident", icon: ShieldAlert },
  ],
  monitor: [
    { title: "Dashboard", url: "/monitor", icon: LayoutDashboard },
    { title: "Verifications", url: "/monitor/verify", icon: FileText },
  ],
  superadmin: [
    { title: "Overview", url: "/superadmin", icon: LayoutDashboard },
    { title: "Users & Roles", url: "/superadmin/users", icon: Settings },
    { title: "Blog CMS", url: "/superadmin/blog", icon: FileText },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  // Determine which nav items to show based on URL prefix (mock role logic)
  const role = pathname.startsWith('/superadmin') ? 'superadmin' : 
               pathname.startsWith('/monitor') ? 'monitor' : 'agent'
               
  const items = navItems[role]

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-primary">NEMS Portal</span>
                  <span className="text-xs text-muted-foreground capitalize">{role}</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                <SidebarMenuButton isActive={pathname === item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
