"use client"

import { useState } from "react"

import { StatsCards } from "@/components/dashboard/stats-cards"
import { MapWrapper } from "@/components/dashboard/map-wrapper"
import { LiveFeedGallery } from "@/components/dashboard/live-feed-gallery"
import { ResultsChart } from "@/components/dashboard/results-chart"
import { IncidentTicker } from "@/components/dashboard/incident-ticker"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ElectionType } from "@/lib/types"
import { ELECTION_TYPES } from "@/lib/constants"

export default function PublicDashboardPage() {
  const [electionType, setElectionType] = useState<ElectionType>('presidential')
  
  return (

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Top bar: Tabs + Realtime indicator */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Tabs defaultValue="presidential" onValueChange={(v) => setElectionType(v as ElectionType)} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-2 md:flex md:w-auto overflow-x-auto">
              <TabsTrigger value="presidential">Presidential</TabsTrigger>
              <TabsTrigger value="governorship">Governorship</TabsTrigger>
              <TabsTrigger value="senate" className="hidden sm:inline-flex">Senate</TabsTrigger>
              <TabsTrigger value="house_of_reps" className="hidden sm:inline-flex">House of Reps</TabsTrigger>
              <TabsTrigger value="state_assembly" className="hidden md:inline-flex">State Assembly</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">Live Updates Active</span>
          </div>
        </div>

        {/* Hierarchy Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-8 p-4 glass-card rounded-lg items-center">
          <h3 className="text-sm font-medium w-full sm:w-auto mr-2">Filter Data:</h3>
          <Select defaultValue="national">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National (All)</SelectItem>
              <SelectItem value="lagos">Lagos</SelectItem>
              <SelectItem value="kano">Kano</SelectItem>
              <SelectItem value="rivers">Rivers</SelectItem>
            </SelectContent>
          </Select>
          
          <Select disabled>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="LGA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All LGAs</SelectItem>
            </SelectContent>
          </Select>
          
          <Select disabled>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <StatsCards />

        {/* Main Grid: Map + Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 h-[450px]">
            <MapWrapper />
          </div>
          <div className="lg:col-span-1 h-[450px]">
            <LiveFeedGallery />
          </div>
        </div>

        {/* Bottom Grid: Results Chart + Incidents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ResultsChart />
          <IncidentTicker />
        </div>

      </main>

  )
}
