import { useState, useRef, useEffect } from 'react'

interface ChatMessage {
  sender: 'user' | 'admin'
  text: string
  time: string
}

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function Contact() {
  // Contact form state
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  // Chat state
  const [chat, setChat] = useState<ChatMessage[]>([
    { sender: 'admin', text: 'Hi there! Welcome to College Corps. How can we help you today?', time: now() },
  ])
  const [chatInput, setChatInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat])

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

  const sendChatMessage = () => {
    const text = chatInput.trim()
    if (!text) return
    setChat((prev) => [...prev, { sender: 'user', text, time: now() }])
    setChatInput('')
    // Auto-reply placeholder — will be replaced with real backend in Phase 3
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          sender: 'admin',
          text: "Thanks for your message! A member of our team will get back to you within 1–2 business days.",
          time: now(),
        },
      ])
    }, 800)
  }

  const handleChatKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage()
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14">
      <h1 className="text-4xl font-bold text-cp-green mb-2 text-center">Contact &amp; Questions</h1>
      <p className="text-gray-500 text-center mb-12">
        Have a question about College Corps? Fill out the form or chat with us below.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold text-cp-green mb-6">Send Us a Message</h2>
          {formStatus === 'sent' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-green-700">
              <p className="font-semibold text-lg">Message sent!</p>
              <p className="mt-1">We'll get back to you within 1–2 business days.</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cp-green"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cp-green"
                  placeholder="you@calpoly.edu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cp-green resize-none"
                  placeholder="Tell us what's on your mind…"
                />
              </div>
              {formStatus === 'error' && (
                <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
              )}
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full py-3 bg-cp-green text-white font-semibold rounded-lg hover:bg-cp-green-light transition-colors disabled:opacity-60"
              >
                {formStatus === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Chat Box */}
        <div>
          <h2 className="text-2xl font-semibold text-cp-green mb-6">Live Chat</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-96">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      msg.sender === 'user'
                        ? 'bg-cp-green text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-green-200' : 'text-gray-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3 bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKey}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cp-green"
                placeholder="Type a message… (Enter to send)"
              />
              <button
                onClick={sendChatMessage}
                className="px-4 py-2 bg-cp-green text-white rounded-lg text-sm font-medium hover:bg-cp-green-light transition-colors"
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
  )
}
