import { createClient } from '@supabase/supabase-js'
import type { AppointmentData } from '@/types/chatbot'

// Uses your existing Supabase project
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side inserts
)

export async function saveAppointment(data: AppointmentData): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chatbot_appointments')
      .insert([
        {
          parent_name: data.parent_name,
          child_name: data.child_name,
          child_age: data.child_age,
          service: data.service,
          phone: data.phone,
          preferred_time: data.preferred_time ?? null,
          notes: data.notes ?? null,
          language: data.language ?? 'ar',
          status: 'pending',
          source: 'chatbot',
          created_at: new Date().toISOString(),
        },
      ])

    if (error) {
      console.error('Supabase insert error:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('saveAppointment error:', err)
    return false
  }
}

/*
  ═══════════════════════════════════════════
  RUN THIS SQL IN YOUR SUPABASE DASHBOARD
  ═══════════════════════════════════════════

  create table chatbot_appointments (
    id uuid primary key default gen_random_uuid(),
    parent_name text not null,
    child_name text not null,
    child_age text not null,
    service text not null,
    phone text not null,
    preferred_time text,
    notes text,
    language text default 'ar',
    status text default 'pending',
    source text default 'chatbot',
    created_at timestamptz default now()
  );

  -- Optional: enable Row Level Security
  alter table chatbot_appointments enable row level security;

  -- Allow server-side inserts (service role bypasses RLS)
  create policy "service role only"
    on chatbot_appointments
    for all
    using (false);
*/
