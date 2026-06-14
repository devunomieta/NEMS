import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

// Dynamically import the map component with ssr: false
// This prevents "window is not defined" errors during build
export const MapWrapper = dynamic(
  () => import('./nigeria-map'),
  { 
    ssr: false,
    loading: () => <Skeleton className="w-full h-full min-h-[400px] rounded-xl" />
  }
)
