'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { ChatMessage, ApiMessage } from '@/types/chatbot'

// ─── Helpers ────────────────────────────────────────────────────────────────

function isArabicDominant(text: string): boolean {
  const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length
  const latinChars  = (text.match(/[a-zA-Z]/g) || []).length
  return arabicChars >= latinChars
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'مرحباً بك في مركز ريادة! 👋 أنا رايا، مساعدتك الذكية.\n\nهل تبحث عن خدماتنا، تريد حجز موعد، أو لديك سؤال؟ أنا هنا للمساعدة!\n\n─────────────────\n\nWelcome to Riyada Center! 👋 I\'m Raya, your AI assistant.\n\nLooking for our services, want to book an appointment, or have a question? I\'m here to help!',
  timestamp: new Date(),
}

// ─── Quick Reply Chips ───────────────────────────────────────────────────────

const QUICK_REPLIES = [
  { ar: 'خدماتنا', en: 'Our Services' },
  { ar: 'حجز موعد', en: 'Book Appointment' },
  { ar: 'الموقع والأوقات', en: 'Location & Hours' },
  { ar: 'أي علاج يناسب طفلي؟', en: 'Which therapy suits my child?' },
]

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [messages,  setMessages]  = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input,     setInput]     = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const [showQuick, setShowQuick] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  // ─── Send Message ──────────────────────────────────────────────────────────

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim()
    if (!content || isLoading) return

    setShowQuick(false)

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      // Build API message history (exclude the welcome message)
      const apiMessages: ApiMessage[] = [...messages, userMsg]
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()

      // Extract text from Claude's response (may contain mixed block types)
      const replyText =
        data.content
          ?.filter((b: { type: string }) => b.type === 'text')
          ?.map((b: { text: string }) => b.text)
          ?.join('') ||
        'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.\nSorry, something went wrong. Please try again.'

      setMessages(prev => [
        ...prev,
        {
          id:        generateId(),
          role:      'assistant',
          content:   replyText,
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      console.error('[ChatWidget] Error:', err)
      setMessages(prev => [
        ...prev,
        {
          id:        generateId(),
          role:      'assistant',
          content:   'عذراً، حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.\nSorry, connection error. Please try again later.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages])

  // ─── Keyboard Handler ──────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Chat Panel ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            position:     'fixed',
            bottom:       '5.5rem',
            right:        '1.5rem',
            zIndex:       9999,
            width:        '384px',
            maxWidth:     'calc(100vw - 2rem)',
            maxHeight:    '620px',
            display:      'flex',
            flexDirection:'column',
            background:   '#ffffff',
            borderRadius: '1.25rem',
            boxShadow:    '0 25px 60px rgba(51,85,238,0.18), 0 8px 24px rgba(0,0,0,0.12)',
            border:       '1px solid #e5e7eb',
            overflow:     'hidden',
            fontFamily:   'system-ui, -apple-system, "Segoe UI", sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              background:     'linear-gradient(135deg, #3355EE 0%, #5577FF 100%)',
              padding:        '0.875rem 1rem',
              display:        'flex',
              alignItems:     'center',
              gap:            '0.75rem',
              flexShrink:     0,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width:          '2.5rem',
                height:         '2.5rem',
                borderRadius:   '50%',
                background:     'rgba(255,255,255,0.25)',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontSize:       '1.1rem',
                fontWeight:     700,
                color:          '#fff',
                flexShrink:     0,
                border:         '2px solid rgba(255,255,255,0.4)',
              }}
            >
              ر
            </div>

            {/* Title */}
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', margin: 0, lineHeight: 1.2 }}>
                رايا · Raya
              </p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', margin: 0, marginTop: '0.15rem' }}>
                مركز ريادة · Riyada Center
              </p>
            </div>

            {/* Online dot + Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 0 2px rgba(74,222,128,0.4)',
                  display: 'inline-block',
                  animation: 'pulse 2s infinite',
                }}
              />
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  width: '1.75rem', height: '1.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', fontSize: '1rem',
                }}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex:       1,
              overflowY:  'auto',
              padding:    '1rem',
              background: '#f9fafb',
              display:    'flex',
              flexDirection: 'column',
              gap:        '0.625rem',
            }}
          >
            {messages.map(msg => {
              const rtl    = isArabicDominant(msg.content)
              const isUser = msg.role === 'user'

              return (
                <div
                  key={msg.id}
                  style={{
                    display:        'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    dir={rtl ? 'rtl' : 'ltr'}
                    style={{
                      maxWidth:      '82%',
                      padding:       '0.625rem 0.875rem',
                      borderRadius:  isUser
                        ? '1rem 1rem 0.25rem 1rem'
                        : '1rem 1rem 1rem 0.25rem',
                      background:    isUser ? '#3355EE' : '#ffffff',
                      color:         isUser ? '#ffffff' : '#1f2937',
                      fontSize:      '0.85rem',
                      lineHeight:    1.6,
                      whiteSpace:    'pre-wrap',
                      boxShadow:     isUser
                        ? '0 2px 8px rgba(51,85,238,0.3)'
                        : '0 1px 4px rgba(0,0,0,0.08)',
                      border:        isUser ? 'none' : '1px solid #e5e7eb',
                      textAlign:     rtl ? 'right' : 'left',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    background:   '#ffffff',
                    border:       '1px solid #e5e7eb',
                    borderRadius: '1rem 1rem 1rem 0.25rem',
                    padding:      '0.75rem 1rem',
                    display:      'flex',
                    gap:          '0.35rem',
                    alignItems:   'center',
                    boxShadow:    '0 1px 4px rgba(0,0,0,0.08)',
                  }}
                >
                  {[0, 150, 300].map(delay => (
                    <span
                      key={delay}
                      style={{
                        width:      '7px',
                        height:     '7px',
                        borderRadius: '50%',
                        background: '#3355EE',
                        display:    'inline-block',
                        animation:  `bounce 1.2s ${delay}ms infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {showQuick && (
            <div
              style={{
                padding:    '0.5rem 0.75rem',
                background: '#f9fafb',
                borderTop:  '1px solid #f0f0f0',
                display:    'flex',
                flexWrap:   'wrap',
                gap:        '0.4rem',
              }}
            >
              {QUICK_REPLIES.map(chip => (
                <button
                  key={chip.en}
                  onClick={() => sendMessage(chip.ar)}
                  style={{
                    background:   '#fff',
                    border:       '1.5px solid #3355EE',
                    borderRadius: '2rem',
                    padding:      '0.3rem 0.75rem',
                    fontSize:     '0.75rem',
                    color:        '#3355EE',
                    cursor:       'pointer',
                    fontWeight:   600,
                    transition:   'all 0.15s',
                    whiteSpace:   'nowrap',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLButtonElement).style.background = '#3355EE'
                    ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLButtonElement).style.background = '#fff'
                    ;(e.currentTarget as HTMLButtonElement).style.color = '#3355EE'
                  }}
                >
                  {chip.ar}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div
            style={{
              padding:    '0.75rem',
              background: '#ffffff',
              borderTop:  '1px solid #e5e7eb',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالتك... / Type your message..."
                rows={1}
                dir="auto"
                style={{
                  flex:         1,
                  resize:       'none',
                  border:       '1.5px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  padding:      '0.625rem 0.875rem',
                  fontSize:     '0.85rem',
                  color:        '#1f2937',
                  outline:      'none',
                  maxHeight:    '6rem',
                  fontFamily:   'inherit',
                  lineHeight:   1.5,
                  transition:   'border-color 0.15s',
                  background:   '#fafafa',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#3355EE' }}
                onBlur={e  => { e.currentTarget.style.borderColor = '#e5e7eb' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                style={{
                  width:          '2.5rem',
                  height:         '2.5rem',
                  borderRadius:   '0.75rem',
                  background:     input.trim() && !isLoading ? '#3355EE' : '#c7d2fe',
                  border:         'none',
                  cursor:         input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  flexShrink:     0,
                  transition:     'background 0.15s',
                  fontSize:       '1.1rem',
                }}
                aria-label="Send message"
              >
                {isLoading ? (
                  <span style={{ color: '#fff', fontSize: '0.8rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
              </button>
            </div>
            <p
              style={{
                textAlign:  'center',
                fontSize:   '0.65rem',
                color:      '#9ca3af',
                marginTop:  '0.4rem',
                marginBottom: 0,
              }}
            >
              Powered by Riyada Center AI · مدعوم بذكاء اصطناعي
            </p>
          </div>
        </div>
      )}

      {/* ── Floating Toggle Button ─────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        style={{
          position:       'fixed',
          bottom:         '1.5rem',
          right:          '1.5rem',
          zIndex:         9999,
          width:          '3.5rem',
          height:         '3.5rem',
          borderRadius:   '50%',
          background:     '#3355EE',
          border:         'none',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          boxShadow:      '0 8px 24px rgba(51,85,238,0.45)',
          transition:     'transform 0.2s, box-shadow 0.2s',
          fontSize:       '1.4rem',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(51,85,238,0.55)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(51,85,238,0.45)'
        }}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}

        {/* Unread badge */}
        {hasUnread && !isOpen && (
          <span
            style={{
              position:       'absolute',
              top:            '-2px',
              right:          '-2px',
              width:          '1rem',
              height:         '1rem',
              borderRadius:   '50%',
              background:     '#ef4444',
              border:         '2px solid white',
              fontSize:       '0.55rem',
              color:          '#fff',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontWeight:     700,
            }}
          >
            1
          </span>
        )}
      </button>

      {/* ── Keyframe Animations ────────────────────────────────────────────── */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
