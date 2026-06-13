import { CheckCircle2, Video, Database, Lock, Globe2, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      title: "Real-time Aggregation",
      description: "Results are aggregated instantly from 176,846 polling units to the national dashboard.",
      icon: Activity,
    },
    {
      title: "Hybrid Data Inputs",
      description: "Support for BVAS snapshots, form EC8A uploads, and live video feeds from polling units.",
      icon: Video,
    },
    {
      title: "Secure Verification",
      description: "Multi-tier verification system ensures only authentic results are published to the public.",
      icon: Lock,
    },
    {
      title: "National Coverage",
      description: "Interactive map drilling down from National to State, LGA, Ward, and Polling Unit levels.",
      icon: Globe2,
    },
    {
      title: "Immutable Records",
      description: "All submissions, changes, and verifications are recorded in a permanent audit log.",
      icon: Database,
    },
    {
      title: "Public Transparency",
      description: "Open access for citizens and observers to track election progress as it happens.",
      icon: CheckCircle2,
    },
  ]

  return (
    <section className="w-full py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Built for Transparency and Scale
          </h2>
          <p className="max-w-[800px] text-lg text-muted-foreground">
            Our platform provides end-to-end visibility into the electoral process, from the polling unit to the national collation center.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} className="glass border-primary/10 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
