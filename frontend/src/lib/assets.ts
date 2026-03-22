/**
 * Asset URL helper
 *
 * Local dev:  VITE_STORAGE_URL is unset → returns /media/filename (served from public/media/)
 * Production: VITE_STORAGE_URL=https://xxx.supabase.co/storage/v1/object/public/media
 *             → returns the full Supabase Storage URL
 *
 * Usage:
 *   import { assetUrl } from '../lib/assets'
 *   <img src={assetUrl('hero/banner.jpg')} />
 *   <video src={assetUrl('cohorts/climate-action.mp4')} />
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.VITE_STORAGE_URL
  if (base) {
    return `${base.replace(/\/$/, '')}/${path}`
  }
  return `/media/${path}`
}
