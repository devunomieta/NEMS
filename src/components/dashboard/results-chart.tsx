"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { PARTIES } from "@/lib/constants"

const dummyData = [
  { party: "APC", votes: 5432100, fill: PARTIES.find(p => p.id === 'apc')?.color },
  { party: "PDP", votes: 4210500, fill: PARTIES.find(p => p.id === 'pdp')?.color },
  { party: "LP", votes: 3100200, fill: PARTIES.find(p => p.id === 'lp')?.color },
  { party: "NNPP", votes: 1500300, fill: PARTIES.find(p => p.id === 'nnpp')?.color },
  { party: "ADC", votes: 850000, fill: PARTIES.find(p => p.id === 'adc')?.color },
  { party: "NDC", votes: 213689, fill: PARTIES.find(p => p.id === 'ndc')?.color },
]

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomYAxisTick = (props: any) => {
  const { x, y, payload } = props
  const partyInfo = PARTIES.find(p => p.name === payload.value)
  
  if (!partyInfo) return <text x={x} y={y} dy={4} textAnchor="end" fill="#888">{payload.value}</text>

  return (
    <g transform={`translate(${x},${y})`}>
      <a href={partyInfo.websiteUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer hover:underline">
        <text x={-10} y={4} textAnchor="end" fill="currentColor" className="text-sm font-medium fill-foreground hover:fill-primary transition-colors">
          {payload.value}
        </text>
      </a>
      <image href={partyInfo.flagUrl} x={-40} y={-10} height={20} width={25} preserveAspectRatio="xMidYMid slice" />
    </g>
  )
}

export function ResultsChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 glass">
      <CardHeader>
        <CardTitle>National Results</CardTitle>
        <CardDescription>
          Live vote count across top parties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dummyData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <YAxis dataKey="party" type="category" axisLine={false} tickLine={false} tick={<CustomYAxisTick />} width={70} />
              <Tooltip 
                formatter={(value: any) => new Intl.NumberFormat('en-NG').format(Number(value) || 0)}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                {dummyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
