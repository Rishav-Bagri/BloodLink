import express from 'express'
import prisma from '../../DB/db.js'

const hospitalRouter = express.Router()

// GET all hospitals
hospitalRouter.get('/', async (req, res) => {
  try {
    const hospitals = await prisma.Hospital.findMany()
    res.json(hospitals)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hospitals' })
  }
})

// GET single hospital by ID
hospitalRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const hospital = await prisma.Hospital.findUnique({
      where: { id },
    })
    if (!hospital) return res.status(404).json({ error: 'Hospital not found' })
    res.json(hospital)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hospital' })
  }
})

// GET all users (patients, donors, staff) of a hospital
hospitalRouter.get('/:id/users', async (req, res) => {
  const { id } = req.params
  try {
    const users = await prisma.User.findMany({
      where: { hospitalId: id }
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// CREATE hospital
hospitalRouter.post('/create', async (req, res) => {
  const { name, address, city, state, pincode, contact, latitude, longitude } = req.body
  try {
    const newHospital = await prisma.Hospital.create({
      data: { name, address, city, state, pincode, contact, latitude, longitude }
    })
    res.status(201).json(newHospital)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create hospital' })
  }
})

// REGISTER hospital
hospitalRouter.post('/register', async (req, res) => {
  const { email, password, hospitalData } = req.body
  try {
    // check if already exists
    const existing = await prisma.HospitalAccount.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'Email already registered' })
    
    // create hospital info
    const hospital = await prisma.Hospital.create({ data: hospitalData })

    // create account
    const account = await prisma.HospitalAccount.create({
      data: {
        email,
        password,
        hospitalId: hospital.id
      }
    })

    res.status(201).json({ message: 'Hospital registered successfully', hospital, account })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to register hospital' })
  }
})

// LOGIN hospital
hospitalRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const account = await prisma.HospitalAccount.findUnique({
      where: { email },
      include: { hospital: true }
    })
    if (!account) return res.status(404).json({ error: 'Account not found' })

    if (account.password !== password)
      return res.status(401).json({ error: 'Invalid credentials' })

    res.json({ message: 'Login successful', hospital: account.hospital })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Login failed' })
  }
})


// UPDATE hospital (requires logged check)
hospitalRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params
  const { loggedId, hospitalData } = req.body
  try {
    if (!loggedId || loggedId !== id) {
      return res.status(403).json({ error: 'Unauthorized: Not logged in or invalid hospital' })
    }

    const updatedHospital = await prisma.Hospital.update({
      where: { id },
      data: hospitalData
    })
    res.json(updatedHospital)
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: 'Failed to update hospital' })
  }
})

// DELETE hospital (requires logged check)
hospitalRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  const { loggedId } = req.body

  try {
    if (!loggedId || loggedId !== id) {
      return res.status(403).json({ error: 'Unauthorized: Not logged in or invalid hospital' })
    }

    await prisma.Hospital.delete({ where: { id } })
    res.json({ message: 'Hospital deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hospital' })
  }
})


export default hospitalRouter
