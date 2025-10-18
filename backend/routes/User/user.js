import express from 'express'
import prisma from '../../DB/db.js'

const userRouter = express.Router()

// 1️⃣ GET all users (include hospital info)
userRouter.get('/all', async (req, res) => {
  try {
    const users = await prisma.User.findMany({
      include: { hospital: true },
    })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// 2️⃣ GET user by ID (include hospital info)
userRouter.get('/id/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await prisma.User.findUnique({
      where: { id },
      include: { hospital: true },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// 3️⃣ CREATE user (optionally assign to hospital)
userRouter.post('/create', async (req, res) => {
  const {
    name,
    dateOfBirth,
    gender,
    contact,
    email,
    bloodGroup,
    userType,
    lastDonation,
    isEligible,
    weight,
    hemoglobin,
    hospitalId,
  } = req.body

  try {
    const newUser = await prisma.User.create({
      data: {
        name,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        contact,
        email,
        bloodGroup,
        userType,
        lastDonation: lastDonation ? new Date(lastDonation) : undefined,
        isEligible,
        weight,
        hemoglobin,
        hospital: hospitalId ? { connect: { id: hospitalId } } : undefined,
      },
      include: { hospital: true },
    })
    res.status(201).json(newUser)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// 4️⃣ UPDATE user (flexible, including donation info)
userRouter.put('/update/:id', async (req, res) => {
  const { id } = req.params
  const updateData = { ...req.body }

  if (updateData.dateOfBirth) updateData.dateOfBirth = new Date(updateData.dateOfBirth)
  if (updateData.lastDonation) updateData.lastDonation = new Date(updateData.lastDonation)

  const hospitalId = updateData.hospitalId
  if (hospitalId !== undefined) {
    updateData.hospital = { connect: { id: hospitalId } }
    delete updateData.hospitalId
  }

  try {
    const updatedUser = await prisma.User.update({
      where: { id },
      data: updateData,
      include: { hospital: true },
    })
    res.json(updatedUser)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// 5️⃣ DELETE user
userRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    await prisma.User.delete({ where: { id } })
    res.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// SEARCH users by name, contact, or email (partial matches)
userRouter.get('/search', async (req, res) => {
  const { name, contact, email } = req.query

  try {
    // if none of the fields provided, return empty array
    if (!name && !contact && !email) return res.json([])

    const orConditions = []
    if (name) orConditions.push({ name: { contains: name, mode: 'insensitive' } })
    if (contact) orConditions.push({ contact: { contains: contact } })
    if (email) orConditions.push({ email: { contains: email, mode: 'insensitive' } })

    const users = await prisma.User.findMany({
      where: {
        OR: orConditions
      },
      include: { hospital: true },
    })

    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to search users' })
  }
})



// 7️⃣ LIST users for dropdown (minimal info, optionally by hospital)
userRouter.get('/list', async (req, res) => {
  const { hospitalId } = req.query
  
  try {
    const users = await prisma.User.findMany({
      where: hospitalId ? { hospitalId } : {},
      select: { id: true, name: true, contact: true, bloodGroup: true },
    })
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch users list' })
  }
})

export default userRouter
