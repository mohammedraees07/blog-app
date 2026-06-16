import User from "../models/User.js";
import Blog from "../models/Blog.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email role");
    console.log(users);
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! please try again.",
    });
  }
};

export const deleteUserById = async (req, res) => {
  try {

      if (req.params.id === req.userInfo.userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    await Blog.deleteMany({ author: user._id });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! please try again.",
    });
  }
};
