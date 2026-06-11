export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  childAge: string;
  concern: string;
  message: string;
  reviewed: boolean;
  createdAt: string;
};

const STORAGE_KEY = 'riyada.contactMessages.v1';

function safeParse(raw: string | null): ContactMessage[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ContactMessage[];
  } catch {
    return [];
  }
}

export function getContactMessages(): ContactMessage[] {
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function setContactMessages(messages: ContactMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export function addContactMessage(input: Omit<ContactMessage, 'id' | 'createdAt' | 'reviewed'> & { id?: string }) {
  const current = getContactMessages();
  const id = input.id ?? generateNextId(current);
  const message: ContactMessage = {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    service: input.service,
    childAge: input.childAge,
    concern: input.concern,
    message: input.message,
    reviewed: false,
    createdAt: new Date().toISOString(),
  };
  setContactMessages([message, ...current]);
  return message;
}

function generateNextId(current: ContactMessage[]) {
  let max = 0;
  for (const item of current) {
    const m = item.id.match(/RCM-(\d{4})-(\d+)/);
    if (m) {
      const n = Number(m[2]);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    }
  }
  const next = (max + 1).toString().padStart(4, '0');
  const year = new Date().getFullYear();
  return `RCM-${year}-${next}`;
}

export function clearContactMessages() {
  localStorage.removeItem(STORAGE_KEY);
}
