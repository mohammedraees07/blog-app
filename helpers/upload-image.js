import cloudinary from "../config/cloudinary.js";
import fs from "fs"


const removeFromLocal = (filepath)=>{
    console.log("Deleting:", filepath);
    return fs.unlinkSync(filepath);
}

const uploadToCloudinary = async(filePath) =>{
    try {

        const result = await cloudinary.uploader.upload(filePath)

        return {
            url : result.secure_url,
            publicId: result.public_id,
        }
        
    } catch (error) {
            console.log("Error while uplaoding to cloudinary ", error); 

            throw new Error('Error while uplaoding to cloudinary')
      
        
    }finally{
        removeFromLocal(filePath)
    }
}

export default uploadToCloudinary;

