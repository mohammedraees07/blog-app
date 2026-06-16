import express from "express"
import authMiddleware from "../middleware/auth-middleware.js"
import { createBlog, deleteBlog, getAllBlog, getBlogById, updateBlog } from "../controllers/blog-controller.js"
import changesMiddleware from "../middleware/changes-middleware.js"


const router = express.Router()


router.post('/blogs',authMiddleware,createBlog)

router.get('/blogs',getAllBlog)
router.get('/blogs/:id',getBlogById)

router.put('/blogs/:id',authMiddleware,changesMiddleware,updateBlog)

router.delete('/blogs/:id',authMiddleware,changesMiddleware,deleteBlog)

export default router