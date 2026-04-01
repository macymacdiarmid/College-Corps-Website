import { useState, useRef, useEffect } from 'react'
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

interface DBMessage {
  id: string
  question: string
  answer: string | null
  created_at: string
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [messages, setMessages] = useState<DBMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [sending, setSending] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionId = getSessionId()

  async function fetchMessages() {
    const { data } = await supabase
      .from('chat_messages')
      .select('id, question, answer, created_at')
      .eq('session_id', sessionId)
      .order('created_at')
    if (data !== null) setMessages(data)
  }

  useEffect(() => {
    fetchMessages()
    intervalRef.current = setInterval(fetchMessages, 4000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Server error')
      setFormStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setFormStatus('error')
    }
  }

  async function sendChatMessage() {
    const text = chatInput.trim()
    if (!text || sending) return
    setSending(true)
    setChatInput('')
    // Optimistically show message immediately
    const optimistic: DBMessage = {
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

  const handleChatKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-cc-blue-dark text-white py-14 px-4 text-center">
        <p className="text-cc-orange font-semibold uppercase tracking-widest text-sm mb-3">Get In Touch</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Keep In Touch</h1>
        <p className="text-cc-blue-light text-lg max-w-xl mx-auto">
          Have a question about College Corps? We're here to help.
        </p>
      </section>

      {/* Info cards */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Email */}
          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-cc-blue-dark flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-cc-blue mb-3">Comments, Questions, or Suggestions?</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Potential and current Fellows are encouraged to reach out to us through email with anything that is College Corps related.
            </p>
            <a
              href="mailto:collegecorps@calpoly.edu"
              className="text-cc-blue font-semibold text-sm hover:text-cc-orange transition-colors underline underline-offset-2"
            >
              collegecorps@calpoly.edu
            </a>
          </div>

          {/* Office location */}
          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-cc-blue-dark flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-cc-blue mb-3">Come Visit Us!</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Our office is located in <span className="font-semibold text-gray-700">Building 81 (Hillcrest)</span>
            </p>
            <div className="bg-cc-blue-dark text-white rounded-lg px-4 py-3 text-sm">
              <p className="font-medium mb-0.5">Our Address:</p>
              <p>81 S Perimeter Rd</p>
              <p>San Luis Obispo, CA 93407</p>
            </div>
          </div>

          {/* Office hours */}
          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-cc-blue-dark flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-cc-blue mb-3">Office Hours</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Someone from our College Corps Team will always be in Building 81 during office hours.
            </p>
            <div className="space-y-1">
              <p className="font-bold text-cc-blue text-sm underline underline-offset-2">Monday to Friday</p>
              <p className="font-bold text-cc-blue text-sm underline underline-offset-2">9 am to 5 pm</p>
            </div>
          </div>

        </div>

        {/* Socials */}
        <div className="max-w-5xl mx-auto mt-8 flex justify-center gap-6">
          <a
            href="https://www.instagram.com/calpolycollegecorps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-6 py-4 hover:shadow-md transition-shadow group"
          >
            <svg className="w-7 h-7 text-cc-blue group-hover:text-cc-orange transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Instagram</p>
              <p className="text-sm font-semibold text-cc-blue group-hover:text-cc-orange transition-colors">@calpolycollegecorps</p>
            </div>
          </a>

          <a
            href="https://www.tiktok.com/@calpolycollegecorps"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-2xl shadow-sm px-6 py-4 hover:shadow-md transition-shadow group"
          >
            <svg className="w-7 h-7 text-cc-blue group-hover:text-cc-orange transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
            </svg>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">TikTok</p>
              <p className="text-sm font-semibold text-cc-blue group-hover:text-cc-orange transition-colors">@calpolycollegecorps</p>
            </div>
          </a>
        </div>

      </section>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-cc-blue mb-6">Send Us a Message</h2>
            {formStatus === 'sent' ? (
              <div className="bg-blue-50 border border-cc-blue-light rounded-lg p-6 text-cc-blue">
                <p className="font-semibold text-lg">Message sent!</p>
                <p className="mt-1">We'll get back to you within 1–2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cc-blue"
                    placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cc-blue"
                    placeholder="you@calpoly.edu" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={5} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cc-blue resize-none"
                    placeholder="Tell us what's on your mind…" />
                </div>
                {formStatus === 'error' && (
                  <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                )}
                <button type="submit" disabled={formStatus === 'sending'}
                  className="w-full py-3 bg-cc-blue text-white font-semibold rounded-lg hover:bg-cc-blue-navy transition-colors disabled:opacity-60">
                  {formStatus === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Live Chat */}
          <div>
            <h2 className="text-2xl font-semibold text-cc-blue mb-6">Live Chat</h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-96">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      👋 Have a question? Send us a message and we'll reply shortly!
                    </p>
                  </div>
                )}
                {messages.map(m => (
                  <div key={m.id} className="space-y-2">
                    {/* User question */}
                    <div className="flex justify-end">
                      <div className="max-w-xs px-4 py-2 rounded-2xl rounded-br-none text-sm bg-cc-blue text-white">
                        <p>{m.question}</p>
                        <p className="text-xs mt-1 text-cc-blue-light">
                          {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    {/* Answer or waiting */}
                    <div className="flex justify-start">
                      {m.answer ? (
                        <div className="max-w-xs px-4 py-2 rounded-2xl rounded-bl-none text-sm bg-white border border-gray-200 text-gray-800">
                          <p>{m.answer}</p>
                          <p className="text-xs mt-1 text-gray-400">College Corps</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-bl-none">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-gray-200 p-3 bg-white flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleChatKey}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue"
                  placeholder="Type a message… (Enter to send)"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || sending}
                  className="px-4 py-2 bg-cc-blue text-white rounded-lg text-sm font-medium hover:bg-cc-blue-navy transition-colors disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Typical response time: 1–2 business days. For urgent matters, email us directly.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
