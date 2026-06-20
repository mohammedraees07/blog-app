import Blog from "../models/Blog.js";
import uploadToCloudinary from "../helpers/upload-image.js";
import cloudinary from "../../NodeJS Auth/config/cloudinary.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.userInfo.userId;

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    const newlyCreatedBlog = await Blog.create({
      title,
      image: { url, publicId },
      content,
      author,
    });

    res.status(201).json({
      success: true,
      message: "blog posted successfully",
      data: newlyCreatedBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "failed to create blog. Please try again",
    });
  }
};

export const getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate("author", "username");

    if (blogs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No blogs posted yet",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went worng. please try again",
    });
  }
};
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username",
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "No blog posted by this id",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    await cloudinary.uploader.destroy(blog.image.publicId);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "No blog found by this id",
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    
    let image, title, content;

    if (!req.body.title?.trim()) {
      title = req.blog.title;
    } else {
      title = req.body.title;
    }

    if (!req.file) {
      image = req.blog.image;
    } else {
      await cloudinary.uploader.destroy(req.blog.image.publicId);
      const { url, publicId } = await uploadToCloudinary(req.file.path);
      image = {
        url,
        publicId,
      };
    }

    if (!req.body.content?.trim()) {
      content = req.blog.content;
    } else {
      content = req.body.content;
    }
    const updateData = { title, image, content };

    const data = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: data,
    });
  } catch (error) {
  console.log(error);

  res.status(404).json({
    success: false,
    message: error.message,
  });
}
};
