export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

export interface AppointmentData {
  parent_name: string
  child_name: string
  child_age: string
  service: string
  phone: string
  preferred_time?: string
  notes?: string
  language?: 'ar' | 'en'
}

export interface ApiMessage {
  role: MessageRole
  content: string
}
