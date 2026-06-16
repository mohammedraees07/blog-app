import dotenv from "dotenv"
import express from "express"
import connectToDB from "./database/db.js"
import authRoutes from "./routes/auth-route.js"
import blogRoutes from "./routes/blog-route.js"
import adminRoutes from "./routes/admin-route.js"


dotenv.config();
const app = express()



const PORT = process.env.PORT || 3000

// middleware
app.use(express.json())

app.use('/api/auth',authRoutes)
app.use('/api/blogInfo',blogRoutes)
app.use('/api/admin',adminRoutes)

const startServer = async()=>{
    try {
        await connectToDB()

        app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.error(error);
    }

}

startServer()