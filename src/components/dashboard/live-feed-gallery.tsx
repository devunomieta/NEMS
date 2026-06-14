"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Radio } from "lucide-react"
import { LiveKitViewer } from "./live-kit-viewer"

const dummyFeeds = [
  { id: 1, type: "live", pu: "PU 001 - Ikeja", time: "Live", url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=300&auto=format&fit=crop" },
  { id: 2, type: "recorded", pu: "PU 045 - Kano", time: "2m ago", url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=300&auto=format&fit=crop" },
  { id: 3, type: "bvas", pu: "PU 112 - Rivers", time: "5m ago", url: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?q=80&w=300&auto=format&fit=crop" },
  { id: 4, type: "form", pu: "PU 023 - Enugu", time: "12m ago", url: "https://images.unsplash.com/photo-1568205612837-017257d2310a?q=80&w=300&auto=format&fit=crop" },
]

export function LiveFeedGallery() {
  const [activeRooms, setActiveRooms] = useState<any[]>([])

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('/api/livekit/rooms')
        if (res.ok) {
          const data = await res.json()
          setActiveRooms(data.rooms || [])
        }
      } catch (err) {
        console.error("Failed to fetch live rooms:", err)
      }
    }
    
    fetchRooms()
    const interval = setInterval(fetchRooms, 3000)
    return () => clearInterval(interval)
  }, [])
  return (
    <Card className="glass h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Live Feed</CardTitle>
          <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
        </div>
        <CardDescription>Recent media from polling units</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <Radio className="h-3 w-3" /> Active Broadcasts
          </h4>
          {activeRooms.length > 0 ? (
            <div className="space-y-4">
              {activeRooms.map((room: any) => (
                <div key={room.name} className="relative rounded-md overflow-hidden border">
                  <div className="absolute top-2 left-2 z-10 bg-destructive/90 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                    {room.name}
                  </div>
                  <LiveKitViewer roomName={room.name} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 p-8 rounded-md flex items-center justify-center text-sm text-muted-foreground border border-dashed">
              No active live streams at the moment.
            </div>
          )}
        </div>

        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent Recordings</h4>
        <div className="grid grid-cols-2 gap-2">
          {dummyFeeds.map((feed) => (
            <div key={feed.id} className="relative group cursor-pointer overflow-hidden rounded-md aspect-video bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={feed.url} 
                alt={feed.pu}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayCircle className="text-white h-8 w-8" />
              </div>
              <div className="absolute top-1 right-1 flex gap-1">
                {feed.type === "live" && <Badge variant="destructive" className="text-[10px] h-4 px-1">LIVE</Badge>}
                {feed.type === "bvas" && <Badge variant="secondary" className="text-[10px] h-4 px-1">BVAS</Badge>}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 pt-4 text-white text-[10px] truncate">
                {feed.pu} • {feed.time}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
