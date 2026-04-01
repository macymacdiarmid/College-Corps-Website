import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface ChatMessage {
  id: string
  session_id: string
  question: string
  answer: string | null
  created_at: string
  answered_at: string | null
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

function groupBySession(messages: ChatMessage[]): [string, ChatMessage[]][] {
  const map: Record<string, ChatMessage[]> = {}
  for (const m of messages) {
    if (!map[m.session_id]) map[m.session_id] = []
    map[m.session_id].push(m)
  }
  return Object.entries(map).sort(([, a], [, b]) =>
    new Date(b[b.length - 1].created_at).getTime() - new Date(a[a.length - 1].created_at).getTime()
  )
}

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [replies, setReplies] = useState<Record<string, string>>({})
  const [sending, setSending] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function load() {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
    setMessages(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedSession, messages])

  async function handleReply(messageId: string) {
    const text = replies[messageId]?.trim()
    if (!text) return
    setSending(messageId)
    await supabase.from('chat_messages').update({
      answer: text,
      answered_at: new Date().toISOString(),
    }).eq('id', messageId)
    setReplies(r => ({ ...r, [messageId]: '' }))
    setSending(null)
    load()
  }

  async function handleDelete(sessionId: string) {
    if (!confirm('Delete this entire conversation?')) return
    await supabase.from('chat_messages').delete().eq('session_id', sessionId)
    setSelectedSession(null)
    load()
  }

  const sessions = groupBySession(messages)
  const unanswered = messages.filter(m => !m.answer).length
  const selectedMessages = selectedSession
    ? messages.filter(m => m.session_id === selectedSession)
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cc-blue">ChatBot</h1>
        <p className="text-gray-500 text-sm mt-1">
          {unanswered > 0
            ? <span className="text-cc-orange font-medium">{unanswered} unanswered message{unanswered !== 1 ? 's' : ''}</span>
            : 'All messages answered'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Conversation list */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-cc-blue text-sm">{sessions.length} Conversation{sessions.length !== 1 ? 's' : ''}</p>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-400 text-sm">Loading…</div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No messages yet.</div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {sessions.map(([sessionId, msgs]) => {
                const latest = msgs[msgs.length - 1]
                const hasUnanswered = msgs.some(m => !m.answer)
                const isSelected = selectedSession === sessionId
                return (
                  <button
                    key={sessionId}
                    onClick={() => setSelectedSession(sessionId)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-cc-blue/5 border-l-4 border-cc-blue' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{fmt(latest.created_at)}</span>
                      {hasUnanswered && (
                        <span className="w-2.5 h-2.5 rounded-full bg-cc-orange flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700 truncate">{latest.question}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{msgs.length} message{msgs.length !== 1 ? 's' : ''}</p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Conversation detail */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          {!selectedSession ? (
            <div className="flex-1 flex items-center justify-center p-8 text-gray-400 text-sm">
              Select a conversation to view and reply
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-cc-blue">Conversation</p>
                  <p className="text-xs text-gray-400 font-mono">{selectedSession.slice(0, 12)}…</p>
                </div>
                <button
                  onClick={() => handleDelete(selectedSession)}
                  className="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[500px]">
                {selectedMessages.map(m => (
                  <div key={m.id} className="space-y-3">
                    {/* User question */}
                    <div className="flex justify-end">
                      <div className="max-w-[75%]">
                        <div className="bg-cc-blue text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm leading-relaxed">
                          {m.question}
                        </div>
                        <p className="text-xs text-gray-400 text-right mt-1">{fmt(m.created_at)}</p>
                      </div>
                    </div>

                    {/* Answer or reply box */}
                    {m.answer ? (
                      <div className="flex justify-start">
                        <div className="max-w-[75%]">
                          <div className="bg-gray-100 text-gray-800 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm leading-relaxed">
                            {m.answer}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{m.answered_at ? fmt(m.answered_at) : ''}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={replies[m.id] ?? ''}
                          onChange={e => setReplies(r => ({ ...r, [m.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleReply(m.id) }}
                          rows={3}
                          placeholder="Type your reply… (⌘+Enter to send)"
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cc-blue resize-none"
                        />
                        <button
                          onClick={() => handleReply(m.id)}
                          disabled={!replies[m.id]?.trim() || sending === m.id}
                          className="self-end px-5 py-2 bg-cc-blue text-white rounded-lg text-sm font-medium hover:bg-cc-blue-navy transition-colors disabled:opacity-50"
                        >
                          {sending === m.id ? 'Sending…' : 'Send Reply'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
