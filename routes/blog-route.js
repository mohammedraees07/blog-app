import express from "express"
import authMiddleware from "../middleware/auth-middleware.js"
import { createBlog, deleteBlog, getAllBlog, getBlogById, updateBlog } from "../controllers/blog-controller.js"
import changesMiddleware from "../middleware/changes-middleware.js"
import uploadMiddleware from "../middleware/upload-middleware.js"


const router = express.Router()


router.post('/blogs',authMiddleware,uploadMiddleware,createBlog)

router.get('/blogs',getAllBlog)
router.get('/blogs/:id',getBlogById)

router.patch('/blogs/:id',authMiddleware,changesMiddleware,uploadMiddleware,updateBlog)

router.delete('/blogs/:id',authMiddleware,changesMiddleware,deleteBlog)

export default router