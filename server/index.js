import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from 'dns'
import path from 'path'
import { fileURLToPath } from 'url'

dns.setServers(['8.8.8.8', '1.1.1.1'])

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGODB_URI

const allowedOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(',').map((s) => s.trim())
  : ['http://localhost:5173', 'http://127.0.0.1:5173']
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
  }),
)
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8')
    }
  },
}))

const registrationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  address: String,
}, { timestamps: true })

const Registration = mongoose.model('Registration', registrationSchema)

app.post('/api/registrations', async (req, res) => {
  try {
    const registration = new Registration(req.body)
    await registration.save()
    res.status(201).json({ message: 'Registration saved' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error saving registration' })
  }
})

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', req.rawBody)
    return res.status(400).json({ error: 'Invalid JSON payload' })
  }
  next(err)
})

app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 })
    res.json(registrations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error fetching registrations' })
  }
})

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB Atlas')
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })
