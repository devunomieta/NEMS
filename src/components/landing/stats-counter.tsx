import { Card, CardContent } from "@/components/ui/card"

export function StatsCounter() {
  const stats = [
    { value: "36 + FCT", label: "States Covered" },
    { value: "774", label: "Local Government Areas" },
    { value: "8,809", label: "Wards" },
    { value: "176,846", label: "Polling Units" },
  ]

  return (
    <section className="w-full py-16 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-none bg-transparent">
              <CardContent className="p-0 text-center space-y-2">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-primary tracking-tighter">
                  {stat.value}
                </div>
                <p className="text-sm md:text-base font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
