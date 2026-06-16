import Blog from "../models/Blog.js"


const changesMiddleware = async (req,res,next)=>{
    const blog = await Blog.findById(req.params.id)
    if(!blog){
         return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    if(blog.author.toString() === req.userInfo.userId){
        next()
    }else{
        return res.status(403).json({
            success : false,
            message : "Access denied. you don't have permission"
        })
    }
}

export default changesMiddleware;