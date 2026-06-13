import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Map as MapIcon, ShieldCheck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
      
      {/* Nigeria Map Watermark Silhouette placeholder (CSS shape for now) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-screen hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] fill-current text-primary">
          <path d="M 30,50 C 40,20 60,20 80,40 C 90,60 70,90 40,80 C 10,70 10,60 30,50 Z" />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
          Live 2027 General Elections
        </div>
        
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground mb-6">
          Nigeria <span className="text-primary">Election</span> Monitoring System
        </h1>
        
        <p className="max-w-2xl text-xl text-muted-foreground mb-10 leading-relaxed">
          Real-time, transparent, and secure monitoring of the 2027 General Elections across all 36 states and the FCT, covering 176,846 polling units.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 transition-all hover:scale-105">
            <Link href="/dashboard">
              Monitor Live
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-semibold rounded-full glass hover:bg-muted/50 transition-all hover:scale-105">
            <Link href="/login">
              Agent Login
            </Link>
          </Button>
        </div>
        
        {/* Quick feature highlights below hero buttons */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-muted-foreground border-t border-border/50 pt-10 w-full max-w-3xl">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-medium">Verified Results</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <MapIcon className="h-5 w-5 text-primary" />
            <span className="font-medium">National Coverage</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-medium">Real-time Analytics</span>
          </div>
        </div>
      </div>
    </section>
  )
}
