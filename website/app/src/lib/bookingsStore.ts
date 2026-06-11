export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

export type Booking = {
  id: string;
  patient: string;
  service: string;
  package?: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: BookingStatus;
  parentName?: string;
  phone?: string;
  age?: string;
  notes?: string;
};

const STORAGE_KEY = 'riyada.bookings.v1';

function safeParse(raw: string | null): Booking[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Booking[];
  } catch {
    return [];
  }
}

export function getBookings(): Booking[] {
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function setBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function addBooking(input: Omit<Booking, 'id'> & { id?: string }) {
  const current = getBookings();

  const id = input.id ?? generateNextId(current);
  const booking: Booking = {
    id,
    patient: input.patient,
    service: input.service,
    package: input.package,
    date: input.date,
    time: input.time,
    status: input.status,
  };

  setBookings([booking, ...current]);
  return booking;
}

function generateNextId(current: Booking[]) {
  // Keeps your existing RMC-2026-0001 style
  // Find max numeric suffix
  let max = 0;
  for (const b of current) {
    const m = b.id.match(/RMC-\d{4}-(\d+)/);
    if (m) {
      const n = Number(m[1]);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
  }
  const next = (max + 1).toString().padStart(4, '0');
  const year = new Date().getFullYear();
  return `RMC-${year}-${next}`;
}

export function clearBookings() {
  localStorage.removeItem(STORAGE_KEY);
}

