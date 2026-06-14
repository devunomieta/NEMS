import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { ArrowRight, BarChart3, Map as MapIcon, ShieldCheck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-12 md:py-20 lg:py-24">
      {/* Premium Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background dark:via-black dark:to-black" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      
      {/* Nigeria Map Watermark Silhouette */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.02] dark:opacity-[0.04] pointer-events-none hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-[1000px] h-[1000px] fill-current text-primary">
          <path d="M 30,50 C 40,20 60,20 80,40 C 90,60 70,90 40,80 C 10,70 10,60 30,50 Z" />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-white/5 dark:bg-black/20 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-md shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
          Live 2027 General Elections
        </div>
        
        <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-foreground mb-6 drop-shadow-sm">
          Nigeria <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Election</span> Monitoring System
        </h1>
        
        <p className="max-w-2xl text-xl text-muted-foreground mb-10 leading-relaxed drop-shadow-sm">
          Real-time, transparent, and secure monitoring of the 2027 General Elections across all 36 states and the FCT, covering 176,846 polling units.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-20">
          <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-lg font-semibold rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 bg-gradient-to-r from-primary to-green-600 hover:from-primary hover:to-primary flex items-center justify-center gap-2" })}>
            Monitor Live
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 text-lg font-semibold rounded-full glass-card hover:bg-muted/50 transition-all hover:scale-105 backdrop-blur-xl border-white/20 dark:border-white/10" })}>
            Agent Login
          </Link>
        </div>
        
        {/* Floating Decorative Glass Cards - Pushed to edges and restricted to XL screens to avoid text overlap */}
        <div className="hidden xl:block absolute left-4 top-[30%] -rotate-6 animate-pulse glass-card p-4 rounded-xl shadow-2xl backdrop-blur-xl border-white/20 dark:bg-black/40">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">100% Verified</p>
              <p className="text-xs text-muted-foreground">Blockchain Secure</p>
            </div>
          </div>
        </div>

        <div className="hidden xl:block absolute right-4 top-[45%] rotate-3 animate-pulse glass-card p-4 rounded-xl shadow-2xl backdrop-blur-xl border-white/20 dark:bg-black/40" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">176,846 PUs</p>
              <p className="text-xs text-muted-foreground">Live Data Feed</p>
            </div>
          </div>
        </div>

        {/* Quick feature highlights below hero buttons */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-muted-foreground border-t border-border/50 pt-8 w-full max-w-3xl">
          <div className="flex items-center justify-center gap-2 group cursor-default">
            <ShieldCheck className="h-5 w-5 text-primary group-hover:scale-125 transition-transform" />
            <span className="font-medium group-hover:text-foreground transition-colors">Verified Results</span>
          </div>
          <div className="flex items-center justify-center gap-2 group cursor-default">
            <MapIcon className="h-5 w-5 text-primary group-hover:scale-125 transition-transform" />
            <span className="font-medium group-hover:text-foreground transition-colors">National Coverage</span>
          </div>
          <div className="flex items-center justify-center gap-2 group cursor-default">
            <BarChart3 className="h-5 w-5 text-primary group-hover:scale-125 transition-transform" />
            <span className="font-medium group-hover:text-foreground transition-colors">Real-time Analytics</span>
          </div>
        </div>
      </div>
    </section>
  )
}
