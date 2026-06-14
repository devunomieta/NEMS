import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserRole } from '@/lib/types'

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch role from users table
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()
          
        if (data) {
          setRole(data.role as UserRole)
        }
      }
      setIsLoading(false)
    }

    fetchRole()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { role, isLoading }
}
