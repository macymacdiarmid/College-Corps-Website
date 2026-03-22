import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import contactRouter from './routes/contact'
import newsletterRouter from './routes/newsletter'
import applyRouter from './routes/apply'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/contact',     contactRouter)
app.use('/api/newsletters', newsletterRouter)
app.use('/api/apply',       applyRouter)

app.listen(PORT, () => {
  console.log(`College Corps API running on http://localhost:${PORT}`)
})
