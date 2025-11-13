import express from 'express'
import prisma from '../../DB/db.js'

const inventoryRouter = express.Router()

// GET all inventory batches
inventoryRouter.get('/', async (req, res) => {
  try {
    const inventory = await prisma.BloodInventory.findMany({
      include: { hospital: true, donation: true }
    })
    res.json(inventory)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch inventory' })
  }
})

// GET single inventory batch
inventoryRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const batch = await prisma.BloodInventory.findUnique({
      where: { id },
      include: { hospital: true, donation: true }
    })
    if (!batch) return res.status(404).json({ error: 'Batch not found' })
    res.json(batch)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch batch' })
  }
})

// GET all inventory for a hospital
inventoryRouter.get('/hospital/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params
  try {
    const inventory = await prisma.BloodInventory.findMany({
      where: { hospitalId },
      include: { donation: true }
    })
    res.json(inventory)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch hospital inventory' })
  }
})

// GET low stock inventory for a hospital
inventoryRouter.get('/low-stock/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params
  try {
    const lowStock = await prisma.BloodInventory.findMany({
      where: {
        hospitalId,
        quantity: { lte: prisma.raw('minQuantity') } // Prisma doesn't allow field comparison directly, handle in JS if needed
      },
      include: { donation: true }
    })
    res.json(lowStock)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch low stock inventory' })
  }
})

// CREATE inventory batch
inventoryRouter.post('/create', async (req, res) => {
  const { hospitalId, bloodGroup, quantity, expiryDate, donationId, minQuantity } = req.body
  try {
    const batch = await prisma.BloodInventory.create({
      data: {
        hospitalId,
        bloodGroup,
        quantity: parseInt(quantity),
        expiryDate: new Date(expiryDate),
        donationId,
        minQuantity: minQuantity ? parseInt(minQuantity) : 0
      }
    })
    res.status(201).json(batch)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create inventory batch' })
  }
})

// UPDATE inventory batch
inventoryRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params
  const updateData = { ...req.body }
  if (updateData.expiryDate) updateData.expiryDate = new Date(updateData.expiryDate)
  if (updateData.quantity) updateData.quantity = parseInt(updateData.quantity)
  if (updateData.minQuantity) updateData.minQuantity = parseInt(updateData.minQuantity)

  try {
    const updatedBatch = await prisma.BloodInventory.update({
      where: { id },
      data: updateData
    })
    res.json(updatedBatch)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update inventory batch' })
  }
})

// DELETE inventory batch
inventoryRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.BloodInventory.delete({ where: { id } })
    res.json({ message: 'Inventory batch deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete inventory batch' })
  }
})

// DEDUCT blood from inventory (for receiving/giving blood to patients)
inventoryRouter.post('/deduct', async (req, res) => {
  const { hospitalId, bloodGroup, unitsRequired } = req.body

  try {
    if (!hospitalId || !bloodGroup || !unitsRequired) {
      return res.status(400).json({ 
        error: 'Missing required fields: hospitalId, bloodGroup, unitsRequired' 
      })
    }

    const units = parseInt(unitsRequired)
    if (units <= 0) {
      return res.status(400).json({ error: 'Units required must be greater than 0' })
    }

    // Get available inventory (non-expired, matching blood group)
    const inventory = await prisma.BloodInventory.findMany({
      where: {
        hospitalId,
        bloodGroup,
        expiryDate: { gt: new Date() } // Only non-expired
      },
      orderBy: { expiryDate: 'asc' } // Use oldest first (FIFO)
    })

    const totalAvailable = inventory.reduce((sum, item) => sum + item.quantity, 0)

    if (totalAvailable < units) {
      return res.status(400).json({
        error: 'Insufficient blood inventory',
        available: totalAvailable,
        required: units,
        message: `Only ${totalAvailable} units available, but ${units} units required`
      })
    }

    // Deduct from inventory (FIFO - First In First Out)
    let remaining = units
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

    // Get updated inventory to return
    const updatedInventory = await prisma.BloodInventory.findMany({
      where: {
        hospitalId,
        bloodGroup,
        expiryDate: { gt: new Date() }
      }
    })

    const newTotal = updatedInventory.reduce((sum, item) => sum + item.quantity, 0)

    res.json({
      message: 'Blood deducted successfully',
      deducted: units,
      remaining: newTotal,
      bloodGroup
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to deduct blood from inventory' })
  }
})

export default inventoryRouter
