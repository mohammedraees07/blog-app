import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const registerUser = async(req,res)=>{
    try {
        const {username , email, password, role} = req.body

        const checkExistingUser = await User.findOne({ $or : [{username},{email}]})

        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : 'User already exists with this username or email. try using different username or email'
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newlyCreatedUser = new User(
            {
            username,
            email,
            password : hashedPassword,
            role : role || "user"
            }
        )

        await newlyCreatedUser.save()

       
            return res.status(201).json(
                {
                    success : true,
                    message : 'user registered successfully',
                }
            )
        


    } catch (error) {
        return res.status(500).json({
            success : false,
            message : 'something went wrong! please try again'
        })
    }
}




export const loginUser = async(req,res)=>{
    try {
        
        const {username , password} = req.body

        const user = await User.findOne({username})

        if(!user){
            return res.status(404).json({
                success : false,
                message : 'User not found with this username. please register to login'
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if(!isPasswordMatch){
            return res.status(401).json({
                success : false,
                message : 'Invalid credentials. Please enter valid credentials'
            })
        }

        const accessToken = jwt.sign(
            {
                userId : user._id,
                username : user.username,
                role: user.role
            },process.env.JWT_SECRET_KEY,{
                expiresIn : '20m'
            }
        )

        return res.status(200).json({
            success : true,
            message : 'Logged in successfully',
            accessToken
        })



    } catch (error) {
         return res.status(500).json({
            success : false,
            message : 'something went wrong! please try again'
        })
    }
}