

const adminMiddleware = (req, res, next) => {
  const role = req.userInfo.role;
  if (role !== "admin") {
    res.status(403).json({
      status: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

export default adminMiddleware;
