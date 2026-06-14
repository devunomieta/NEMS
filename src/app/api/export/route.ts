import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'csv'
  
  if (format === 'csv') {
    const csvData = "State,LGA,Ward,PU,APC,PDP,LP,NNPP,Other\nLagos,Ikeja,Ward 1,PU 001,150,120,45,10,5"
    
    return new NextResponse(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="nems_export.csv"',
      },
    })
  }

  return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
}
