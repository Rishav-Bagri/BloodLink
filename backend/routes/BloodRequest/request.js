import express from 'express'
import prisma from '../../DB/db.js'

const requestRouter = express.Router()

// GET all blood requests
requestRouter.get('/', async (req, res) => {
  try {
    const requests = await prisma.BloodRequest.findMany({
      include: {
        receiver: true,
        hospital: true
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(requests)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch blood requests' })
  }
})

// GET blood requests for a specific hospital
requestRouter.get('/hospital/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params
  try {
    const requests = await prisma.BloodRequest.findMany({
      where: { hospitalId },
      include: {
        receiver: true,
        hospital: true
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(requests)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch hospital blood requests' })
  }
})

// GET single blood request by ID
requestRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const request = await prisma.BloodRequest.findUnique({
      where: { id },
      include: {
        receiver: true,
        hospital: true
      }
    })
    if (!request) return res.status(404).json({ error: 'Blood request not found' })
    res.json(request)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch blood request' })
  }
})

// CREATE blood request (hospital creates request for a patient)
requestRouter.post('/create', async (req, res) => {
  const {
    receiverId,
    hospitalId,
    bloodGroup,
    unitsRequired,
    isEmergency,
    latitude,
    longitude
  } = req.body

  try {
    if (!receiverId || !bloodGroup || !unitsRequired) {
      return res.status(400).json({ error: 'Missing required fields: receiverId, bloodGroup, unitsRequired' })
    }

    const newRequest = await prisma.BloodRequest.create({
      data: {
        receiverId,
        hospitalId: hospitalId || null,
        bloodGroup,
        unitsRequired: parseInt(unitsRequired),
        isEmergency: isEmergency || false,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        status: 'PENDING'
      },
      include: {
        receiver: true,
        hospital: true
      }
    })
    res.status(201).json(newRequest)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create blood request' })
  }
})

// FULFILL blood request (hospital fulfills request by deducting from inventory)
requestRouter.post('/fulfill/:id', async (req, res) => {
  const { id } = req.params
  const { hospitalId } = req.body

  try {
    if (!hospitalId) {
      return res.status(400).json({ error: 'hospitalId is required' })
    }

    // Get the request
    const bloodRequest = await prisma.BloodRequest.findUnique({
      where: { id },
      include: { receiver: true }
    })

    if (!bloodRequest) {
      return res.status(404).json({ error: 'Blood request not found' })
    }

    if (bloodRequest.status !== 'PENDING') {
      return res.status(400).json({ error: 'Request is not pending' })
    }

    // Check hospital inventory
    const inventory = await prisma.BloodInventory.findMany({
      where: {
        hospitalId,
        bloodGroup: bloodRequest.bloodGroup,
        expiryDate: { gt: new Date() } // Only non-expired
      },
      orderBy: { expiryDate: 'asc' } // Use oldest first (FIFO)
    })

    const totalAvailable = inventory.reduce((sum, item) => sum + item.quantity, 0)

    if (totalAvailable < bloodRequest.unitsRequired) {
      return res.status(400).json({
        error: 'Insufficient blood inventory',
        available: totalAvailable,
        required: bloodRequest.unitsRequired
      })
    }

    // Deduct from inventory (FIFO - First In First Out)
    let remaining = bloodRequest.unitsRequired
    const updates = []

    for (const batch of inventory) {
      if (remaining <= 0) break

      if (batch.quantity <= remaining) {
        // Use entire batch
        remaining -= batch.quantity
        updates.push(
          prisma.BloodInventory.delete({ where: { id: batch.id } })
        )
      } else {
        // Use partial batch
        updates.push(
          prisma.BloodInventory.update({
            where: { id: batch.id },
            data: { quantity: batch.quantity - remaining }
          })
        )
        remaining = 0
      }
    }

    // Execute all inventory updates
    await Promise.all(updates)

    // Update request status
    const fulfilledRequest = await prisma.BloodRequest.update({
      where: { id },
      data: {
        status: 'FULFILLED',
        hospitalId: hospitalId // Assign to fulfilling hospital
      },
      include: {
        receiver: true,
        hospital: true
      }
    })

    res.json({
      message: 'Blood request fulfilled successfully',
      request: fulfilledRequest
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fulfill blood request' })
  }
})

// UPDATE blood request status
requestRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params
  const { status, hospitalId } = req.body

  try {
    const updateData = {}
    if (status) updateData.status = status
    if (hospitalId) updateData.hospitalId = hospitalId

    const updatedRequest = await prisma.BloodRequest.update({
      where: { id },
      data: updateData,
      include: {
        receiver: true,
        hospital: true
      }
    })
    res.json(updatedRequest)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update blood request' })
  }
})

// CANCEL blood request
requestRouter.put('/cancel/:id', async (req, res) => {
  const { id } = req.params
  try {
    const cancelledRequest = await prisma.BloodRequest.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        receiver: true,
        hospital: true
      }
    })
    res.json({ message: 'Blood request cancelled', request: cancelledRequest })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to cancel blood request' })
  }
})

// DELETE blood request
requestRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.BloodRequest.delete({ where: { id } })
    res.json({ message: 'Blood request deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete blood request' })
  }
})

export default requestRouter

