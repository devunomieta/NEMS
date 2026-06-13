import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/landing/hero"
import { StatsCounter } from "@/components/landing/stats-counter"
import { Features } from "@/components/landing/features"
import { CTA } from "@/components/landing/cta"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <StatsCounter />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
