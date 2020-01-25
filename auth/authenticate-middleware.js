/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require('jsonwebtoken')

const secrets = require('../config/secrets.js')

module.exports = (req, res, next) => {

  const token = req.headers.authorization;

  try {

    const decoded = jwt.verify(token, secrets.jwtSecret)
    req.decoded = decoded;
    next();

  } catch(err) {

    res.status(401).json({ you: 'shall not pass!' });

  }

};
