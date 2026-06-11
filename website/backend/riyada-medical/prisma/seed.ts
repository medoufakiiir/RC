// prisma/seed.ts
// Run: npx prisma db seed

import { PrismaClient, DayOfWeek, Specialty } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── 1. Initialize booking sequence ──────────────────────────────────────
  await prisma.bookingSequence.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, value: 0 },
  })

  // ── 2. Admin user ────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('RiyadaAdmin2025!', 12)

  await prisma.adminUser.upsert({
    where: { email: 'admin@riyadamedical.com' },
    update: {},
    create: {
      name: 'Dua Atieh',
      email: 'admin@riyadamedical.com',
      password: hashedPassword,
      role: 'superadmin',
    },
  })
  console.log('✅ Admin user created')

  // ── 3. Therapists ────────────────────────────────────────────────────────
  const weekdays = [
    DayOfWeek.SUNDAY,
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
  ]

  const therapists = [
    {
      nameAr: 'أخصائية النطق واللغة ١',
      nameEn: 'Speech Therapist 1',
      titleAr: 'أخصائية النطق واللغة',
      titleEn: 'Speech & Language Therapist',
      specialty: Specialty.SPEECH,
      sortOrder: 1,
    },
    {
      nameAr: 'أخصائي ABA ١',
      nameEn: 'ABA Specialist 1',
      titleAr: 'أخصائي تحليل السلوك التطبيقي',
      titleEn: 'Applied Behavior Analysis Specialist',
      specialty: Specialty.ABA,
      sortOrder: 2,
    },
    {
      nameAr: 'أخصائية العلاج الوظيفي ١',
      nameEn: 'OT Specialist 1',
      titleAr: 'أخصائية العلاج الوظيفي',
      titleEn: 'Occupational Therapist',
      specialty: Specialty.OT,
      sortOrder: 3,
    },
    {
      nameAr: 'أخصائي التقييم',
      nameEn: 'Assessment Specialist',
      titleAr: 'أخصائي التقييم والاستشارات',
      titleEn: 'Assessment & Consultation Specialist',
      specialty: Specialty.ASSESSMENT,
      sortOrder: 4,
    },
  ]

  for (const therapist of therapists) {
    const created = await prisma.therapist.upsert({
      where: { id: `seed-${therapist.specialty.toLowerCase()}` },
      update: {},
      create: {
        id: `seed-${therapist.specialty.toLowerCase()}`,
        ...therapist,
        // Default schedule: Sun–Thu, 9AM–5PM
        schedules: {
          create: weekdays.map((day) => ({
            dayOfWeek: day,
            startTime: '09:00',
            endTime: '17:00',
            isActive: true,
          })),
        },
      },
    })
    console.log(`✅ Therapist: ${created.nameEn}`)
  }

  // ── 4. Saudi public holidays 2025 ────────────────────────────────────────
  const holidays2025 = [
    { date: new Date('2025-02-22'), nameAr: 'يوم التأسيس', nameEn: 'Saudi Founding Day' },
    { date: new Date('2025-09-23'), nameAr: 'اليوم الوطني', nameEn: 'Saudi National Day' },
  ]

  for (const holiday of holidays2025) {
    await prisma.publicHoliday.upsert({
      where: { date: holiday.date },
      update: {},
      create: holiday,
    })
  }
  console.log('✅ Public holidays seeded')

  console.log('🎉 Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
