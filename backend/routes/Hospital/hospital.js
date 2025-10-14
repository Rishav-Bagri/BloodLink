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
      include: { user: true }
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

// UPDATE hospital
hospitalRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params
  try {
    const updatedHospital = await prisma.Hospital.update({
      where: { id },
      data: req.body
    })
    res.json(updatedHospital)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hospital' })
  }
})

// DELETE hospital
hospitalRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.Hospital.delete({ where: { id } })
    res.json({ message: 'Hospital deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hospital' })
  }
})

export default hospitalRouter
