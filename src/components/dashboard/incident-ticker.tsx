"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, MapPin } from "lucide-react"

const dummyIncidents = [
  { id: 1, text: "BVAS malfunction reported", location: "PU 012, Lagos", time: "Just now", severity: "medium" },
  { id: 2, text: "Late arrival of materials", location: "PU 045, Kano", time: "15m ago", severity: "low" },
  { id: 3, text: "Disruption by unknown individuals", location: "PU 112, Rivers", time: "32m ago", severity: "high" },
  { id: 4, text: "Network failure for transmission", location: "PU 023, Enugu", time: "1h ago", severity: "medium" },
]

export function IncidentTicker() {
  return (
    <Card className="col-span-1 glass h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Incident Log
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-4">
          {dummyIncidents.map((incident) => (
            <div key={incident.id} className="flex gap-3 border-b border-border/50 pb-3 last:border-0">
              <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                incident.severity === 'high' ? 'bg-destructive' : 
                incident.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
              }`} />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{incident.text}</p>
                <div className="flex items-center text-xs text-muted-foreground gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {incident.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {incident.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
