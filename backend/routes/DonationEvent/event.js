import express from 'express'
import prisma from '../../DB/db.js'

const donationEventRouter = express.Router()

// GET all donations
donationEventRouter.get('/', async (req, res) => {
  try {
    const donations = await prisma.DonationEvent.findMany({
      include: { donor: true, hospital: true, camp: true, inventory: true }
    })
    res.json(donations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch donations' })
  }
})

// GET single donation by ID
donationEventRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const donation = await prisma.DonationEvent.findUnique({
      where: { id },
      include: { donor: true, hospital: true, camp: true, inventory: true }
    })
    if (!donation) return res.status(404).json({ error: 'Donation not found' })
    res.json(donation)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch donation' })
  }
})

// GET all donations by donor
donationEventRouter.get('/donor/:donorId', async (req, res) => {
  const { donorId } = req.params
  try {
    const donations = await prisma.DonationEvent.findMany({
      where: { donorId },
      include: { hospital: true, camp: true, inventory: true }
    })
    res.json(donations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch donations for donor' })
  }
})

// GET all donations for hospital
donationEventRouter.get('/hospital/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params
  try {
    const donations = await prisma.DonationEvent.findMany({
      where: { hospitalId },
      include: { donor: true, camp: true, inventory: true }
    })
    res.json(donations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch donations for hospital' })
  }
})

// GET all donations for camp
donationEventRouter.get('/camp/:campId', async (req, res) => {
  const { campId } = req.params
  try {
    const donations = await prisma.DonationEvent.findMany({
      where: { campId },
      include: { donor: true, hospital: true, inventory: true }
    })
    res.json(donations)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch donations for camp' })
  }
})

// CREATE donation
donationEventRouter.post('/create', async (req, res) => {
  const { donorId, hospitalId, campId, date, unitsDonated } = req.body
  try {
    const newDonation = await prisma.DonationEvent.create({
      data: {
        donorId,
        hospitalId: hospitalId || null,
        campId: campId || null,
        date: new Date(date),
        unitsDonated: parseInt(unitsDonated),
      }
    })
    res.status(201).json(newDonation)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create donation' })
  }
})

// UPDATE donation
donationEventRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params
  const updateData = { ...req.body }
  if (updateData.date) updateData.date = new Date(updateData.date)
  if (updateData.unitsDonated) updateData.unitsDonated = parseInt(updateData.unitsDonated)

  try {
    const updatedDonation = await prisma.DonationEvent.update({
      where: { id },
      data: updateData
    })
    res.json(updatedDonation)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update donation' })
  }
})

// DELETE donation
donationEventRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.DonationEvent.delete({ where: { id } })
    res.json({ message: 'Donation deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete donation' })
  }
})

export default donationEventRouter
