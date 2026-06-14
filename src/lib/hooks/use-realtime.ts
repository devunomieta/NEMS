import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Result, Incident } from '@/lib/types'

export function useRealtimeResults() {
  const [results, setResults] = useState<Result[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Fetch initial data
    const fetchInitial = async () => {
      const { data } = await supabase.from('results').select('*').limit(100)
      if (data) setResults(data as Result[])
    }
    fetchInitial()

    // Subscribe to realtime updates
    const channel = supabase
      .channel('results-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'results' }, payload => {
        setResults(prev => [payload.new as Result, ...prev])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'results' }, payload => {
        setResults(prev => prev.map(r => r.id === payload.new.id ? payload.new as Result : r))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return results
}

export function useRealtimeIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchInitial = async () => {
      const { data } = await supabase.from('incidents').select('*').limit(50)
      if (data) setIncidents(data as Incident[])
    }
    fetchInitial()

    const channel = supabase
      .channel('incidents-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incidents' }, payload => {
        setIncidents(prev => [payload.new as Incident, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return incidents
}
