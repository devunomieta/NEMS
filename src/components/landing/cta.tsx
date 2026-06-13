import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="w-full py-24 bg-primary relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-10 top-0 h-64 w-64 rounded-full border-8 border-white/20" />
        <div className="absolute right-10 bottom-10 h-32 w-32 rounded-full border-4 border-white/20" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground tracking-tight">
            Ready to observe the election?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
            Join thousands of observers tracking the process in real-time. Transparent, secure, and accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <Button asChild size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold shadow-xl hover:scale-105 transition-transform text-primary">
              <Link href="/dashboard">
                View Live Dashboard
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-primary-foreground/20 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:scale-105 transition-transform">
              <Link href="/login">
                Agent Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
