const jwt = require('jsonwebtoken');
const User = require('../models/user');


const authenticate = (req, res, next) => {
  const token = req.cookies.authToken; // Récupérer le token depuis le cookie

  if (!token) {
    return res.status(401).send('Authentication failed: No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded._id }; // Ajouter userId à req.user
    next();
  } catch (error) {
    return res.status(401).send('Authentication failed: Invalid token');
  }
};

module.exports = authenticate;

