import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const SESSION_KEY = 'cc_chat_session'

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

interface Message {
  id: string
  question: string
  answer: string | null
  created_at: string
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const sessionId = getSessionId()
  const bottomRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function fetchMessages() {
    const { data } = await supabase
      .from('chat_messages')
      .select('id, question, answer, created_at')
      .eq('session_id', sessionId)
      .order('created_at')
    if (data !== null) setMessages(data)
  }

  useEffect(() => {
    if (!open) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    fetchMessages()
    intervalRef.current = setInterval(fetchMessages, 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || sending) return
    const text = input.trim()
    setSending(true)
    setInput('')
    // Optimistically show message immediately
    const optimistic: Message = {
      id: `optimistic-${Date.now()}`,
      question: text,
      answer: null,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])
    await supabase.from('chat_messages').insert({ session_id: sessionId, question: text })
    setSending(false)
    fetchMessages()
  }

  const unanswered = messages.filter(m => !m.answer).length
  const hasNew = !open && unanswered > 0

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-cc-blue text-white rounded-full shadow-xl flex items-center justify-center hover:bg-cc-blue-navy transition-colors"
        aria-label="Open chat"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {hasNew && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-cc-orange rounded-full text-xs font-bold flex items-center justify-center">
            {unanswered}
          </span>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-cc-blue-dark text-white px-4 py-3 flex-shrink-0">
            <p className="font-bold text-sm">College Corps</p>
            <p className="text-xs text-cc-blue-light">Ask us anything — we'll reply shortly!</p>
          </div>

          {/* Messages */}
          <div className="overflow-y-auto p-4 space-y-4 h-72">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  👋 Have a question about College Corps?<br />Send us a message!
                </p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className="space-y-2">
                {/* User question — right aligned */}
                <div className="flex justify-end">
                  <div className="bg-cc-blue text-white text-sm px-3 py-2 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed">
                    {m.question}
                  </div>
                </div>
                {/* Answer or waiting indicator */}
                <div className="flex justify-start">
                  {m.answer ? (
                    <div className="bg-gray-100 text-gray-800 text-sm px-3 py-2 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
                      {m.answer}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-2xl rounded-tl-sm">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message…"
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cc-blue"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="px-4 py-2 bg-cc-blue text-white rounded-lg text-sm font-medium hover:bg-cc-blue-navy transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
