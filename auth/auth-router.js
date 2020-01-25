const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets.js')

const users = require('../users/users-model.js')

router.post('/register', (req, res, next) => {
  // implement registration

  const user = req.body;

  if(!user || !user.username || !user.password) {
    return res.status(401).json({messaage: 'Please include a username and password to register'})
  }

  users.add(user)
    .then(saved => {
      return res.status(201).json(user = saved)
    })
    .catch(err => {
      return res.status(500).json({message: 'Failed to register user'})
    })

});

router.post('/login', (req, res, next) => {
  // implement login
  try {

    const {username, password} = req.body;
    const user = await.users.findBy({username}).first()
    const passwordValid = await bcrypt.compare(password, user.password)

    if(user && passwordValid) {
      // req.session.user = user; 
      const token = generateToken(user);
      res.status(200).json({
        token: token,
        message: `User ${username} authenticated.`
      })
    }

  } catch(err) {

    res.status(401).json({message: 'Authentication Failed'})

  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }

  const options = {
    expiresIn: '1h'
  }

  return jwt.sign(payload, secrets.jwtSecret, options)

}

module.exports = router;
