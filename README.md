# Nigeria Election Monitoring System (NEMS)

NEMS is a secure, real-time web platform built for transparent election observation in Nigeria, particularly focused on the 2027 General Elections. It aggregates hybrid inputs (live video feeds, recorded media, and text results) from polling units across all 36 states and the FCT.

## Features

- **Public Dashboard**: Real-time aggregation of results from 176,846 polling units. Includes interactive map, live feed gallery, and result charts.
- **Polling Agent Module**: Agents can submit election results (Form EC8A), upload BVAS evidence, report incidents, and go live.
- **Monitoring & Admin Control Room**: Cross-verify submitted data using OCR, flag anomalies, and approve results before public broadcasting.
- **Superadmin Dashboard**: Oversee the entire system, manage users, monitor API rates, and review security audit logs.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, `shadcn/ui`, Lucide Icons
- **Mapping & Charts**: React-Leaflet, Recharts
- **Backend & Auth**: Supabase (PostgreSQL, Realtime, Edge Functions, Auth)
- **Deployment**: Vercel

## Running Locally

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.local` and add your Supabase credentials.
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

Run the SQL migration scripts in the `supabase/` directory in the following order using the Supabase SQL Editor:
1. `001_schema.sql`
2. `002_rls_policies.sql`
3. `003_seed_geography.sql`
4. `004_seed_parties.sql`
5. `005_seed_users.sql`

## Demonstration Credentials
(Configure these within your Supabase project)

- **Agent**: `agent1@nems.demo` / `Demo@2027!`
- **Monitor**: `monitor1@nems.demo` / `Demo@2027!`
- **Superadmin**: `superadmin@nems.demo` / `Demo@2027!`

Developed by @Devunomieta — [devunomieta.xyz](https://devunomieta.xyz)
