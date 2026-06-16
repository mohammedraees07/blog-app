import express from "express"
import { deleteUserById, getAllUsers } from "../controllers/admin-controller.js"
import adminMiddleware from "../middleware/admin-middleware.js"
import authMiddleware from "../middleware/auth-middleware.js"


const router = express.Router()


router.get('/users',authMiddleware,adminMiddleware,getAllUsers)
router.delete('/remove/:id',authMiddleware,adminMiddleware,deleteUserById)


export default router


