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
  const { donorId, hospitalId, campId, date, unitsDonated, bloodGroup } = req.body

  // --- Input Validation ---
  if (!donorId || !date || !unitsDonated || !bloodGroup) {
    return res.status(400).json({
      error: 'Missing required fields: donorId, date, unitsDonated, and bloodGroup are required.'
    })
  }

  if (!hospitalId && !campId) {
    return res.status(400).json({
      error: 'A donation must be linked to either a hospital or a camp.'
    })
  }

  try {
    // --- Transaction begins ---
    const newDonation = await prisma.$transaction(async (tx) => {
      // Step 1: Create the DonationEvent record
      const donationEvent = await tx.DonationEvent.create({
        data: {
          donorId,
          hospitalId: hospitalId || null,
          campId: campId || null,
          date: new Date(date),
          unitsDonated: parseInt(unitsDonated),
        },
      })

      // Step 2: Update donor eligibility and last donation date
      await tx.user.update({
        where: { id: donorId },
        data: {
          lastDonation: new Date(date),
          isEligible: false,
        },
      })

      // Step 3: Update or create BloodInventory if the donation was to a hospital
      if (hospitalId) {
        const expiryDate = new Date(date)
        expiryDate.setDate(expiryDate.getDate() + 42) // standard 42-day expiry

        // Check if inventory for this hospital & blood group already exists
        const existingInventory = await tx.BloodInventory.findFirst({
          where: {
            hospitalId,
            bloodGroup,
          },
        })

        if (existingInventory) {
          // Increment existing stock
          await tx.BloodInventory.update({
            where: { id: existingInventory.id },
            data: {
              quantity: existingInventory.quantity + parseInt(unitsDonated),
              // optionally extend expiry date if newer
              expiryDate:
                expiryDate > existingInventory.expiryDate
                  ? expiryDate
                  : existingInventory.expiryDate,
            },
          })
        } else {
          // Create new inventory record
          await tx.BloodInventory.create({
            data: {
              hospitalId,
              bloodGroup,
              quantity: parseInt(unitsDonated),
              expiryDate,
              donationId: donationEvent.id,
            },
          })
        }
      }

      return donationEvent
    })

    // --- Success response ---
    res.status(201).json(newDonation)
  } catch (err) {
    console.error('Failed to create donation and update inventory:', err)
    res.status(500).json({ error: 'Failed to log donation due to a server error.' })
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
