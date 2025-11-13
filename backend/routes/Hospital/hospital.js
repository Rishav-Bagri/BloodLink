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

// Helper function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}

// EMERGENCY: Search for nearest hospital with available blood
hospitalRouter.post('/emergency/search', async (req, res) => {
  const { hospitalId, bloodGroup, unitsRequired } = req.body
  
  try {
    if (!hospitalId || !bloodGroup || !unitsRequired) {
      return res.status(400).json({ error: 'Missing required fields: hospitalId, bloodGroup, unitsRequired' })
    }

    // Get current hospital
    const currentHospital = await prisma.Hospital.findUnique({
      where: { id: hospitalId }
    })
    
    if (!currentHospital) {
      return res.status(404).json({ error: 'Hospital not found' })
    }

    // Check current hospital's inventory
    const currentInventory = await prisma.BloodInventory.findMany({
      where: {
        hospitalId,
        bloodGroup,
        expiryDate: { gt: new Date() } // Only non-expired blood
      }
    })

    const currentTotal = currentInventory.reduce((sum, item) => sum + item.quantity, 0)

    // If current hospital has enough, return it
    if (currentTotal >= parseInt(unitsRequired)) {
      return res.json({
        hasEnough: true,
        hospital: {
          id: currentHospital.id,
          name: currentHospital.name,
          address: currentHospital.address,
          city: currentHospital.city,
          state: currentHospital.state,
          contact: currentHospital.contact,
          distance: 0,
          availableQuantity: currentTotal
        }
      })
    }

    // Search other hospitals with available blood
    const allHospitals = await prisma.Hospital.findMany({
      where: {
        id: { not: hospitalId } // Exclude current hospital
      },
      include: {
        inventories: {
          where: {
            bloodGroup,
            expiryDate: { gt: new Date() } // Only non-expired
          }
        }
      }
    })

    // Calculate available quantity and distance for each hospital
    const hospitalsWithBlood = allHospitals
      .map(hospital => {
        const availableQuantity = hospital.inventories.reduce(
          (sum, item) => sum + item.quantity, 
          0
        )
        if (availableQuantity >= parseInt(unitsRequired)) {
          const distance = calculateDistance(
            currentHospital.latitude,
            currentHospital.longitude,
            hospital.latitude,
            hospital.longitude
          )
          return {
            id: hospital.id,
            name: hospital.name,
            address: hospital.address,
            city: hospital.city,
            state: hospital.state,
            contact: hospital.contact,
            distance: parseFloat(distance.toFixed(2)),
            availableQuantity
          }
        }
        return null
      })
      .filter(h => h !== null)
      .sort((a, b) => a.distance - b.distance) // Sort by distance

    if (hospitalsWithBlood.length === 0) {
      return res.json({
        hasEnough: false,
        currentQuantity: currentTotal,
        nearestHospital: null,
        message: 'No hospitals found with sufficient blood supply'
      })
    }

    // Return nearest hospital
    res.json({
      hasEnough: false,
      currentQuantity: currentTotal,
      nearestHospital: hospitalsWithBlood[0],
      allAvailableHospitals: hospitalsWithBlood // Also return all options
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to search for emergency blood' })
  }
})

// GET hospital statistics/dashboard data
hospitalRouter.get('/stats/:hospitalId', async (req, res) => {
  const { hospitalId } = req.params
  
  try {
    // Get inventory stats
    const inventory = await prisma.BloodInventory.findMany({
      where: { hospitalId }
    })

    const totalInventory = inventory.reduce((sum, item) => sum + item.quantity, 0)
    const expiredInventory = inventory.filter(item => new Date(item.expiryDate) < new Date())
    const expiringSoon = inventory.filter(item => {
      const expiryDate = new Date(item.expiryDate)
      const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24)
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0
    })

    // Group by blood group
    const byBloodGroup = inventory.reduce((acc, item) => {
      if (!acc[item.bloodGroup]) {
        acc[item.bloodGroup] = { total: 0, batches: 0 }
      }
      acc[item.bloodGroup].total += item.quantity
      acc[item.bloodGroup].batches += 1
      return acc
    }, {})

    // Get requests stats
    const requests = await prisma.BloodRequest.findMany({
      where: { hospitalId }
    })

    const pendingRequests = requests.filter(r => r.status === 'PENDING').length
    const fulfilledRequests = requests.filter(r => r.status === 'FULFILLED').length
    const emergencyRequests = requests.filter(r => r.isEmergency && r.status === 'PENDING').length

    // Get donations stats
    const donations = await prisma.DonationEvent.findMany({
      where: { hospitalId }
    })

    const totalDonations = donations.length
    const totalUnitsDonated = donations.reduce((sum, d) => sum + d.unitsDonated, 0)

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentDonations = donations.filter(d => new Date(d.createdAt) > sevenDaysAgo).length
    const recentRequests = requests.filter(r => new Date(r.createdAt) > sevenDaysAgo).length

    res.json({
      inventory: {
        total: totalInventory,
        batches: inventory.length,
        expired: expiredInventory.length,
        expiringSoon: expiringSoon.length,
        byBloodGroup
      },
      requests: {
        total: requests.length,
        pending: pendingRequests,
        fulfilled: fulfilledRequests,
        emergency: emergencyRequests
      },
      donations: {
        total: totalDonations,
        totalUnits: totalUnitsDonated
      },
      recent: {
        donations: recentDonations,
        requests: recentRequests
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

export default hospitalRouter
