import express from "express"
import { changePassword, loginUser, registerUser } from "../controllers/auth-controller.js"
import authMiddleware from "../middleware/auth-middleware.js"


const router = express.Router()


router.post('/login',loginUser)
router.post('/register',registerUser)
router.patch('/change-password',authMiddleware,changePassword)

export default router