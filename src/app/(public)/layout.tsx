import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col relative w-full min-h-screen">
        {/* Premium Background gradients for all public pages */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background dark:via-black dark:to-black -z-10 pointer-events-none" />
        {children}
      </main>
      <Footer />
    </>
  )
}
