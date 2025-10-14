import express from 'express'
import prisma from '../../DB/db.js'


const campRouter = express.Router()

// GET all camps
campRouter.get('/', async (req, res) => {
  try {
    const camps = await prisma.Camp.findMany()
    res.json(camps)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch camps' })
  }
})

// GET single camp by ID
campRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const camp = await prisma.Camp.findUnique({ where: { id } })
    if (!camp) return res.status(404).json({ error: 'Camp not found' })
    res.json(camp)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch camp' })
  }
})

// GET all donations for a camp
campRouter.get('/:id/donations', async (req, res) => {
  const { id } = req.params
  try {
    const donations = await prisma.DonationEvent.findMany({ where: { campId: id } })
    res.json(donations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch donations for camp' })
  }
})

// CREATE camp
campRouter.post('/create', async (req, res) => {
  const { name, location, latitude, longitude, startDate, endDate, organizer } = req.body
  try {
    const newCamp = await prisma.Camp.create({
      data: {
        name,
        location,
        latitude,
        longitude,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        organizer,
      },
    })
    res.status(201).json(newCamp)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create camp' })
  }
})

// UPDATE camp
campRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params
  const updateData = { ...req.body }
  if (updateData.startDate) updateData.startDate = new Date(updateData.startDate)
  if (updateData.endDate) updateData.endDate = new Date(updateData.endDate)

  try {
    const updatedCamp = await prisma.Camp.update({
      where: { id },
      data: updateData,
    })
    res.json(updatedCamp)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update camp' })
  }
})

// DELETE camp
campRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.Camp.delete({ where: { id } })
    res.json({ message: 'Camp deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete camp' })
  }
})

export default campRouter
