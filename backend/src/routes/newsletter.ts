import { Router, Request, Response } from 'express'
import { supabase } from '../db/supabase'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('newsletters')
    .select('id, title, published_at, content, pdf_url')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Supabase error (newsletters):', error)
    return res.status(500).json({ error: 'Failed to fetch newsletters.' })
  }

  return res.json(data)
})

export default router
