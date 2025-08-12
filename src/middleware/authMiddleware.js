const authMiddleware = (req, res, next) => {
  const user = req.headers['x-consumer-username'];

  if (!user) {
    return res.status(401).json({
      status: 'error',
      message: 'Akses tidak diizinkan. Consumer tidak terdeteksi.',
    });
  }

  req.user = user;

  next();
};

module.exports = authMiddleware;