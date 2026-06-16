import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.userInfo.userId;

    const newlyCreatedBlog = await Blog.create({ title, content, author });

    res.status(201).json({
      success: true,
      message: "blog posted successfully",
      data: newlyCreatedBlog,
    });
  } catch (error) {
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
    const { title, content } = req.body;
  

    const blog = await Blog.findByIdAndUpdate(req.params.id,{title,content},{new : true});

  
    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data : blog
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "No blog found by this id",
    });
  }
};
