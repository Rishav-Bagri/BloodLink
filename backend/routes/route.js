// backend/routes.js
import express from 'express'
import userRouter from './User/user.js'
import hospitalRouter from './Hospital/hospital.js'
import campRouter from './Camps/camp.js'
import donationEventRouter from './DonationEvent/event.js'
import inventoryRouter from './BloodInventory/inventory.js'
import requestRouter from './BloodRequest/request.js'



const router = express.Router()

// mount routes
router.use('/users', userRouter)
router.use('/hospitals', hospitalRouter)
router.use('/camps', campRouter)
router.use('/donations', donationEventRouter)
router.use('/inventory', inventoryRouter)
router.use('/requests', requestRouter)

export default router
