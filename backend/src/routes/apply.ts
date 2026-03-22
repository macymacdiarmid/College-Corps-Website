import { Router, Request, Response } from 'express'
import { supabase } from '../db/supabase'

const VALID_COHORTS = ['food', 'climate', 'health', 'k12']

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { name, email, cohort, message } = req.body

  if (!name || !email || !cohort) {
    return res.status(400).json({ error: 'name, email, and cohort are required.' })
  }

  if (!VALID_COHORTS.includes(cohort)) {
    return res.status(400).json({ error: 'Invalid cohort value.' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' })
  }

  const { error } = await supabase
    .from('applications')
    .insert([{
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      cohort: String(cohort),
      message: message ? String(message).slice(0, 2000) : null,
    }])

  if (error) {
    console.error('Supabase error (apply):', error)
    return res.status(500).json({ error: 'Failed to save application. Please try again.' })
  }

  return res.status(201).json({ success: true })
})

export default router
