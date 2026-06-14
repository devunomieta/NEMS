import { Camera, FileSearch, Globe } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: "1. Data Capture",
      description: "Agents at polling units capture results using our secure mobile interface, taking clear photos of official EC8A forms.",
    },
    {
      icon: <FileSearch className="h-8 w-8 text-primary" />,
      title: "2. Verification",
      description: "Submitted results enter a pending queue. Monitors cross-reference the data with the uploaded evidence to ensure total accuracy.",
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "3. Public Display",
      description: "Once verified, the results instantly appear on the public dashboard, providing real-time, transparent access to everyone.",
    }
  ]

  return (
    <section className="py-12 md:py-16 bg-muted/10 dark:bg-muted/5">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How NEMS Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A transparent, three-step process ensuring that every vote counted is verified against physical evidence.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center p-6 glass-card rounded-2xl border border-white/20 dark:border-white/10 dark:bg-black/40 hover:bg-white/90 dark:hover:bg-black/60 transition-colors shadow-lg">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center mb-6 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
