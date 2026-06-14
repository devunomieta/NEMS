"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Incident } from "@/lib/types"

export function LiveTicker() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchLatest = async () => {
      const { data } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (data) setIncidents(data)
    }
    fetchLatest()

    const channel = supabase
      .channel('public:incidents')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incidents' }, payload => {
        setIncidents(prev => [payload.new as Incident, ...prev].slice(0, 5))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (incidents.length === 0) return null

  return (
    <div className="bg-destructive/10 border-b border-destructive/20 text-destructive-foreground py-2 overflow-hidden flex items-center">
      <div className="container mx-auto px-4 flex items-center whitespace-nowrap">
        <div className="flex items-center text-sm font-semibold mr-4 text-destructive shrink-0">
          <AlertCircle className="h-4 w-4 mr-2 animate-pulse" />
          LIVE UPDATES
        </div>
        <div className="overflow-hidden relative w-full flex items-center">
          <div className="animate-marquee inline-block text-sm text-foreground/80">
            {incidents.map((inc, i) => (
              <span key={inc.id} className="mx-4">
                • <strong className="text-destructive capitalize">{inc.severity} Priority:</strong> {inc.description} ({new Date(inc.created_at).toLocaleTimeString()})
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
