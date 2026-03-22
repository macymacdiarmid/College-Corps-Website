import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

interface MediaFile {
  name: string
  url: string
  bucket: string
  created_at: string
}

const BUCKETS = ['media', 'newsletters'] as const
type Bucket = typeof BUCKETS[number]

export default function Media() {
  const [bucket, setBucket] = useState<Bucket>('media')
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function loadFiles(b: Bucket) {
    setLoading(true)
    const { data } = await supabase.storage.from(b).list('', { sortBy: { column: 'created_at', order: 'desc' } })
    const mapped = (data ?? [])
      .filter(f => f.name !== '.emptyFolderPlaceholder')
      .map(f => ({
        name: f.name,
        bucket: b,
        created_at: f.created_at ?? '',
        url: supabase.storage.from(b).getPublicUrl(f.name).data.publicUrl,
      }))
    setFiles(mapped)
    setLoading(false)
  }

  useEffect(() => { loadFiles(bucket) }, [bucket])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error } = await supabase.storage.from(bucket).upload(path, file)
    if (!error) loadFiles(bucket)
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDelete(name: string) {
    if (!confirm(`Delete "${name}"?`)) return
    await supabase.storage.from(bucket).remove([name])
    loadFiles(bucket)
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  function isImage(name: string) {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cc-blue">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">Upload and manage photos, PDFs, and files</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bucket selector */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            {BUCKETS.map(b => (
              <button
                key={b}
                onClick={() => setBucket(b)}
                className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                  bucket === b ? 'bg-cc-blue text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {b === 'media' ? 'Images' : 'Newsletters'}
              </button>
            ))}
          </div>
          {/* Upload button */}
          <label className={`px-5 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            uploading ? 'bg-gray-300 text-gray-500' : 'bg-cc-orange text-white hover:bg-cc-orange-dark'
          }`}>
            {uploading ? 'Uploading…' : '+ Upload'}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
              accept={bucket === 'media' ? 'image/*' : '*'}
            />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">Loading…</div>
      ) : files.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-400 mb-3">No files uploaded yet.</p>
          <label className="px-5 py-2 bg-cc-orange text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-cc-orange-dark transition-colors">
            Upload your first file
            <input type="file" className="hidden" onChange={handleUpload} accept={bucket === 'media' ? 'image/*' : '*'} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map(f => (
            <div key={f.name} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              {/* Preview */}
              <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                {isImage(f.name) ? (
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs uppercase font-medium">{f.name.split('.').pop()}</span>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-gray-700 font-medium truncate mb-2" title={f.name}>{f.name}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyUrl(f.url)}
                    className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${
                      copied === f.url
                        ? 'bg-green-100 text-green-700'
                        : 'bg-cc-blue text-white hover:bg-cc-blue-navy'
                    }`}
                  >
                    {copied === f.url ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(f.name)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
