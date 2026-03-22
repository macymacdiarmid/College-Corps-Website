import { Router, Request, Response } from 'express'
import { supabase } from '../db/supabase'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required.' })
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  const { error } = await supabase
    .from('contact_submissions')
    .insert([{ name: String(name).slice(0, 200), email: String(email).slice(0, 200), message: String(message).slice(0, 5000) }])

  if (error) {
    console.error('Supabase error (contact):', error)
    return res.status(500).json({ error: 'Failed to save message. Please try again.' })
  }

  return res.status(201).json({ success: true })
})

export default router
