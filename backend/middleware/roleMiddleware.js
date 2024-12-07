exports.authorize = (...roles) => {
    console.log("roles ",roles);
    return (req, res, next) => {
      console.log("req.user.role ",req.user.role);
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };
  