# Riyada Center AI Chatbot — Integration Guide

## Files to Add to Your Project

```
your-nextjs-project/
├── types/
│   └── chatbot.ts                        ← TypeScript types
├── lib/
│   └── chatbot/
│       ├── system-prompt.ts              ← Khadija's personality & knowledge
│       └── save-appointment.ts           ← Supabase appointment saving
├── app/
│   └── api/
│       └── chat/
│           └── route.ts                  ← Claude API endpoint
└── components/
    └── chatbot/
        └── ChatWidget.tsx                ← The floating chat UI
```

---

## Step 1 — Install Anthropic SDK

```bash
npm install @anthropic-ai/sdk
```

---

## Step 2 — Add Environment Variables

In your `.env.local` (already have Supabase vars, just add this):

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key at: https://console.anthropic.com

---

## Step 3 — Create Supabase Table

Run this SQL in your Supabase dashboard → SQL Editor:

```sql
create table chatbot_appointments (
  id              uuid primary key default gen_random_uuid(),
  parent_name     text not null,
  child_name      text not null,
  child_age       text not null,
  service         text not null,
  phone           text not null,
  preferred_time  text,
  notes           text,
  language        text default 'ar',
  status          text default 'pending',
  source          text default 'chatbot',
  created_at      timestamptz default now()
);

alter table chatbot_appointments enable row level security;
```

---

## Step 4 — Add Widget to Your Layout

In `app/layout.tsx`:

```tsx
import ChatWidget from '@/components/chatbot/ChatWidget'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidget />   {/* ← Add this line */}
      </body>
    </html>
  )
}
```

That's it! The chatbot will appear on every page. ✅

---

## What Khadija Can Do

| Feature                            | Status |
|------------------------------------|--------|
| Answer questions about services    | ✅     |
| Guide parents to right therapy     | ✅     |
| FAQ (location, hours, insurance)   | ✅     |
| Book appointments (saves to DB)    | ✅     |
| Bilingual Arabic / English         | ✅     |
| Auto RTL detection                 | ✅     |
| Quick reply chips                  | ✅     |
| Typing indicator                   | ✅     |

---

## Customize the System Prompt

Edit `lib/chatbot/system-prompt.ts` to update:
- Center location / phone number
- Insurance providers accepted
- Working hours
- Any new services

---

## View Appointment Requests

In Supabase → Table Editor → `chatbot_appointments`

You'll see all requests with status `pending`. Update status to `confirmed` or `cancelled` after follow-up.

---

## Optional: Email Notification on New Appointment

Add this to `save-appointment.ts` after the Supabase insert:

```ts
// Using Resend / Nodemailer / any email provider
await sendEmail({
  to: 'info@riyada-ventures.com',
  subject: 'طلب موعد جديد / New Appointment Request',
  text: `Parent: ${data.parent_name} | Child: ${data.child_name} | Phone: ${data.phone}`
})
```
