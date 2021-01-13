const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const token = req.header('token');

    if (!token) {
      return res.status(400).json({ status: 400, message: 'needed access token' });
    }

    const payload = jwt.verify(token, process.env.SECRET);

    req.user_id = payload.user_id;
    req.roles = payload.roles;

    next();
  } catch (error) {
    return res.status(400).json({ status: 400, message: 'invalid access token' });
  }
};

module.exports = verifyToken;
