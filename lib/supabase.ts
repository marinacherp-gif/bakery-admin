import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project values when ready
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Database Types ────────────────────────────────────────────────────────────

export interface Announcement {
  id: string
  text: string
  is_active: boolean
  start_at: string | null   // null = immediate
  end_at: string | null     // null = forever
  created_at: string
}

export interface OpeningHour {
  id: string
  day_of_week: number // 0 = Sunday, 6 = Saturday
  is_open: boolean
  open_time: string  // "HH:MM"
  close_time: string // "HH:MM"
}

export interface Item {
  id: string
  name: string
  description: string
  images: string[]  // array of URLs or base64
  price: number
  quantity: number
  category: 'bread' | 'pastry'
  can_be_cut: boolean
  can_buy_half: boolean | null  // optional
  is_vegan: boolean
  available_days: number[] // 0–6
  created_at: string
}

export interface ContactInfo {
  id: string
  phone: string
  email: string
  address: string
  instagram: string
  facebook: string
}

// ─── SQL Schema (run in Supabase SQL editor when ready) ───────────────────────
/*
create table announcements (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table opening_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null unique check (day_of_week between 0 and 6),
  is_open boolean not null default true,
  open_time time not null default '08:00',
  close_time time not null default '18:00'
);

create table items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  images jsonb not null default '[]',
  price numeric(10,2) not null,
  can_be_cut boolean not null,
  can_buy_half boolean,
  is_vegan boolean not null default false,
  available_days jsonb not null default '[0,1,2,3,4,5,6]',
  created_at timestamptz not null default now()
);

create table contact_info (
  id uuid primary key default gen_random_uuid(),
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  instagram text not null default '',
  facebook text not null default ''
);
*/
