const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../supabase');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// 1. Schema
const schemaSql = `
-- Drop tables and types if they exist (for re-running safely)
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.incidents CASCADE;
DROP TABLE IF EXISTS public.results CASCADE;
DROP TABLE IF EXISTS public.parties CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.polling_units CASCADE;
DROP TABLE IF EXISTS public.wards CASCADE;
DROP TABLE IF EXISTS public.lgas CASCADE;
DROP TABLE IF EXISTS public.states CASCADE;

DROP TYPE IF EXISTS election_type CASCADE;
DROP TYPE IF EXISTS data_source CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS severity_level CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE election_type AS ENUM ('presidential', 'governorship', 'senate', 'house_of_reps', 'state_assembly');
CREATE TYPE data_source AS ENUM ('bvas', 'collation_form');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'flagged', 'rejected');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'monitor', 'agent');

-- Tables
CREATE TABLE public.states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    geo_zone VARCHAR(50) NOT NULL
);

CREATE TABLE public.lgas (
    id SERIAL PRIMARY KEY,
    state_id INTEGER REFERENCES public.states(id),
    name VARCHAR(100) NOT NULL
);

CREATE TABLE public.wards (
    id SERIAL PRIMARY KEY,
    lga_id INTEGER REFERENCES public.lgas(id),
    name VARCHAR(100) NOT NULL
);

CREATE TABLE public.polling_units (
    id VARCHAR(50) PRIMARY KEY,
    ward_id INTEGER REFERENCES public.wards(id),
    name VARCHAR(100) NOT NULL,
    registered_voters INTEGER DEFAULT 0
);

CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'agent',
    assigned_pu_id VARCHAR(50) REFERENCES public.polling_units(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.parties (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    full_name VARCHAR(100),
    flag_url TEXT,
    website_url TEXT
);

CREATE TABLE public.results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    polling_unit_id VARCHAR(50) REFERENCES public.polling_units(id),
    election_type election_type NOT NULL,
    data_source data_source NOT NULL,
    accredited_voters INTEGER NOT NULL,
    total_votes_cast INTEGER NOT NULL,
    votes JSONB NOT NULL,
    status verification_status DEFAULT 'pending',
    submitted_by UUID REFERENCES public.users(id),
    verified_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    polling_unit_id VARCHAR(50) REFERENCES public.polling_units(id),
    description TEXT NOT NULL,
    severity severity_level NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    reported_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    author_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);
`;

fs.writeFileSync(path.join(outDir, '001_schema.sql'), schemaSql);

// 2. RLS Policies
const rlsSql = `
-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "States are viewable by everyone." ON public.states;
DROP POLICY IF EXISTS "LGAs are viewable by everyone." ON public.lgas;
DROP POLICY IF EXISTS "Wards are viewable by everyone." ON public.wards;
DROP POLICY IF EXISTS "PUs are viewable by everyone." ON public.polling_units;
DROP POLICY IF EXISTS "Parties are viewable by everyone." ON public.parties;
DROP POLICY IF EXISTS "Verified results are viewable by everyone." ON public.results;
DROP POLICY IF EXISTS "Agents can insert results" ON public.results;
DROP POLICY IF EXISTS "Agents can insert incidents" ON public.incidents;
DROP POLICY IF EXISTS "Monitors can read all results" ON public.results;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Published posts are viewable by everyone." ON public.blog_posts;
DROP POLICY IF EXISTS "Superadmins can manage blog posts" ON public.blog_posts;

-- Enable Row Level Security
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lgas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polling_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Base Policies (Public Read)
CREATE POLICY "States are viewable by everyone." ON public.states FOR SELECT USING (true);
CREATE POLICY "LGAs are viewable by everyone." ON public.lgas FOR SELECT USING (true);
CREATE POLICY "Wards are viewable by everyone." ON public.wards FOR SELECT USING (true);
CREATE POLICY "PUs are viewable by everyone." ON public.polling_units FOR SELECT USING (true);
CREATE POLICY "Parties are viewable by everyone." ON public.parties FOR SELECT USING (true);
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);

-- Results Read (Public)
CREATE POLICY "Verified results are viewable by everyone." ON public.results FOR SELECT USING (status = 'verified');

-- Agents Insert
CREATE POLICY "Agents can insert results" ON public.results FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Agents can insert incidents" ON public.incidents FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- Monitors Read All Results
CREATE POLICY "Monitors can read all results" ON public.results FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role IN ('monitor', 'admin', 'superadmin'))
);

-- Blog Posts Policies
CREATE POLICY "Published posts are viewable by everyone." ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Superadmins can manage blog posts" ON public.blog_posts USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'superadmin')
);
`;

fs.writeFileSync(path.join(outDir, '002_rls_policies.sql'), rlsSql);

// 3. Seed Geography (Akwa Ibom + 9 others)
let geoSql = `
-- Clear existing geographic data (for idempotency)
TRUNCATE TABLE public.polling_units, public.wards, public.lgas, public.states CASCADE;

-- Seed 10 States
INSERT INTO public.states (id, name, geo_zone) VALUES
(3, 'Akwa Ibom', 'South South'),
(25, 'Lagos', 'South West'),
(20, 'Kano', 'North West'),
(33, 'Rivers', 'South South'),
(15, 'FCT - Abuja', 'North Central'),
(14, 'Enugu', 'South East'),
(19, 'Kaduna', 'North West'),
(12, 'Edo', 'South South'),
(30, 'Osun', 'South West'),
(5, 'Bauchi', 'North East');

-- Seed Akwa Ibom LGAs (31)
`;

const realAkwaIbomLGAs = [
  'Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 
  'Etim Ekpo', 'Etinan', 'Ibeno', 'Ibesikpo Asutan', 'Ibiono-Ibom', 
  'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 'Ini', 'Itu', 'Mbo', 
  'Mkpat-Enin', 'Nsit-Atai', 'Nsit-Ibom', 'Nsit-Ubium', 'Obot Akara', 
  'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung-Uko', 'Ukanafun', 
  'Uruan', 'Urue-Offong/Oruko', 'Uyo'
];

const akwaIbomLGAs = realAkwaIbomLGAs.map((name, i) => `(${100+i}, 3, '${name.replace(/'/g, "''")}')`);
geoSql += `INSERT INTO public.lgas (id, state_id, name) VALUES \n` + akwaIbomLGAs.join(',\n') + `;\n\n`;

geoSql += `-- Seed Wards and PUs for Akwa Ibom
DO $$
DECLARE
    lga_record RECORD;
    ward_idx INT := 1;
    pu_idx INT := 1;
BEGIN
    FOR lga_record IN SELECT id FROM public.lgas WHERE state_id = 3 LOOP
        FOR w IN 1..10 LOOP
            INSERT INTO public.wards (id, lga_id, name) VALUES (ward_idx, lga_record.id, 'Ward ' || w);
            
            FOR p IN 1..14 LOOP
                INSERT INTO public.polling_units (id, ward_id, name, registered_voters) 
                VALUES ('PU-AK-' || LPAD(pu_idx::text, 4, '0'), ward_idx, 'PU ' || p || ' Ward ' || w, floor(random() * 500 + 100)::int);
                pu_idx := pu_idx + 1;
            END LOOP;
            
            ward_idx := ward_idx + 1;
        END LOOP;
    END LOOP;
END $$;
`;

fs.writeFileSync(path.join(outDir, '003_seed_geography.sql'), geoSql);

// 4. Parties
const partiesSql = `
-- Clear existing parties data (for idempotency)
TRUNCATE TABLE public.parties CASCADE;

INSERT INTO public.parties (id, name, color, full_name, flag_url, website_url) VALUES
('apc', 'APC', '#00aae4', 'All Progressives Congress', 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/All_Progressives_Congress_logo.svg/200px-All_Progressives_Congress_logo.svg.png', 'https://inecnigeria.org/?page_id=27'),
('pdp', 'PDP', '#006400', 'Peoples Democratic Party', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fa/Peoples_Democratic_Party_%28Nigeria%29_logo.svg/200px-Peoples_Democratic_Party_%28Nigeria%29_logo.svg.png', 'https://inecnigeria.org/?page_id=27'),
('lp', 'LP', '#ff0000', 'Labour Party', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Labour_Party_Nigeria_logo.png/200px-Labour_Party_Nigeria_logo.png', 'https://inecnigeria.org/?page_id=27'),
('nnpp', 'NNPP', '#000080', 'New Nigeria Peoples Party', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/New_Nigeria_Peoples_Party_logo.svg/200px-New_Nigeria_Peoples_Party_logo.svg.png', 'https://inecnigeria.org/?page_id=27'),
('adc', 'ADC', '#008000', 'African Democratic Congress', 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/African_Democratic_Congress.jpg/200px-African_Democratic_Congress.jpg', 'https://inecnigeria.org/?page_id=27'),
('ndc', 'NDC', '#800080', 'National Democratic Congress', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Flag_of_the_National_Democratic_Congress_%28Ghana%29.svg/200px-Flag_of_the_National_Democratic_Congress_%28Ghana%29.svg.png', 'https://inecnigeria.org/?page_id=27');
`;
fs.writeFileSync(path.join(outDir, '004_seed_parties.sql'), partiesSql);

// 5. Users
const usersSql = `
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clean up existing demo users if they exist (for idempotency)
DELETE FROM public.users WHERE email IN ('agent1@nems.demo', 'monitor1@nems.demo', 'superadmin@nems.demo');
DELETE FROM auth.identities WHERE identity_data->>'email' IN ('agent1@nems.demo', 'monitor1@nems.demo', 'superadmin@nems.demo');
DELETE FROM auth.users WHERE email IN ('agent1@nems.demo', 'monitor1@nems.demo', 'superadmin@nems.demo');

DO $$
DECLARE
  agent_id UUID := uuid_generate_v4();
  monitor_id UUID := uuid_generate_v4();
  superadmin_id UUID := uuid_generate_v4();
BEGIN

  -- 1. Agent User
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    role, aud, confirmation_token, email_change, email_change_token_new, recovery_token
  )
  VALUES (
    agent_id,
    '00000000-0000-0000-0000-000000000000',
    'agent1@nems.demo',
    crypt('Demo@2027!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Agent One"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    '', '', '', ''
  );

  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (
    uuid_generate_v4(),
    agent_id,
    agent_id::text,
    format('{"sub": "%s", "email": "%s"}', agent_id, 'agent1@nems.demo')::jsonb,
    'email',
    now(),
    now()
  );

  INSERT INTO public.users (id, email, role, assigned_pu_id)
  VALUES (agent_id, 'agent1@nems.demo', 'agent', 'PU-AK-0001');

  -- 2. Monitor User
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    role, aud, confirmation_token, email_change, email_change_token_new, recovery_token
  )
  VALUES (
    monitor_id,
    '00000000-0000-0000-0000-000000000000',
    'monitor1@nems.demo',
    crypt('Demo@2027!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Monitor One"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    '', '', '', ''
  );

  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (
    uuid_generate_v4(),
    monitor_id,
    monitor_id::text,
    format('{"sub": "%s", "email": "%s"}', monitor_id, 'monitor1@nems.demo')::jsonb,
    'email',
    now(),
    now()
  );

  INSERT INTO public.users (id, email, role)
  VALUES (monitor_id, 'monitor1@nems.demo', 'monitor');

  -- 3. Superadmin User
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    role, aud, confirmation_token, email_change, email_change_token_new, recovery_token
  )
  VALUES (
    superadmin_id,
    '00000000-0000-0000-0000-000000000000',
    'superadmin@nems.demo',
    crypt('Demo@2027!', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Super Admin"}',
    now(),
    now(),
    'authenticated',
    'authenticated',
    '', '', '', ''
  );

  INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, created_at, updated_at)
  VALUES (
    uuid_generate_v4(),
    superadmin_id,
    superadmin_id::text,
    format('{"sub": "%s", "email": "%s"}', superadmin_id, 'superadmin@nems.demo')::jsonb,
    'email',
    now(),
    now()
  );

  INSERT INTO public.users (id, email, role)
  VALUES (superadmin_id, 'superadmin@nems.demo', 'superadmin');

END $$;
`;
fs.writeFileSync(path.join(outDir, '005_seed_users.sql'), usersSql);

// 6. Consolidated main.sql
const mainSql = [
  '-- ==========================================',
  '-- NEMS CONSOLIDATED DATABASE SCHEMA & SEED',
  '-- ==========================================',
  '-- This file is auto-generated. Do not edit directly.',
  '-- It combines schema, RLS policies, geography, parties, and users.',
  '-- ==========================================\n',
  schemaSql,
  rlsSql,
  geoSql,
  partiesSql,
  usersSql
].join('\n\n-- ==========================================\n\n');

fs.writeFileSync(path.join(outDir, 'main.sql'), mainSql);

console.log('SQL generation complete. Consolidated file written to supabase/main.sql');
