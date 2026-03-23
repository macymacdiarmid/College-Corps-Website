import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface FellowPhoto {
  id: string
  fellow_email: string
  fellow_name: string | null
  image_url: string
  file_name: string | null
  created_at: string
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

async function downloadPhoto(url: string, fileName: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileName
    a.click()
    URL.revokeObjectURL(a.href)
  } catch {
    window.open(url, '_blank')
  }
}

export default function FellowPhotos() {
  const [photos, setPhotos] = useState<FellowPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const timeout = setTimeout(() => setLoading(false), 10000)
      try {
        const { data } = await supabase
          .from('fellow_photos')
          .select('*')
          .order('created_at', { ascending: false })
        setPhotos((data as FellowPhoto[]) ?? [])
      } catch { }
      clearTimeout(timeout)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cc-blue">Fellow Photos</h1>
        <p className="text-gray-500 text-sm mt-1">{photos.length} photo{photos.length !== 1 ? 's' : ''} submitted by fellows</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">Loading…</div>
      ) : photos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">No photos submitted yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div
                className="w-full h-40 bg-gray-100 cursor-pointer overflow-hidden"
                onClick={() => setLightbox(p.image_url)}
              >
                <img
                  src={p.image_url}
                  alt={p.file_name ?? 'Fellow photo'}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate">{p.fellow_name || p.fellow_email}</p>
                <p className="text-xs text-gray-400 truncate">{p.fellow_email}</p>
                <p className="text-xs text-gray-400 mt-0.5">{fmt(p.created_at)}</p>
                <button
                  onClick={() => downloadPhoto(p.image_url, p.file_name ?? `photo-${p.id}.jpg`)}
                  className="mt-2 w-full text-xs px-3 py-1.5 bg-cc-blue text-white rounded-lg hover:bg-cc-blue-navy transition-colors font-medium"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold"
          >
            ✕
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
