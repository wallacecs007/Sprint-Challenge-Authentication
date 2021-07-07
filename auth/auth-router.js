const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets.js')

const users = require('../users/users-model.js')

router.post('/register', (req, res, next) => {
  // implement registration

  const user = req.body;

  if(!user || !user.username || !user.password) {
    return res.status(401).json({message: 'Please include a username and password to register'})
  }

  users.add(user)
    .then(saved => {
      return res.status(201).json(saved)
    })
    .catch(err => {
      return res.status(500).json({message: `Failed to register user: ${err}`})
    })

});

router.get('/users', (req, res, next) => {
  const user = users.find()
  .then(saved => {
    return res.status(201).json(saved)
  })
  .catch(err => {
    res.status(401).json({message: 'Getting users failed'})
  })
  // console.log(user)
})

router.post('/login', async(req, res, next) => {
  // implement login
  try {

    // console.log('function running')

    const {username, password} = req.body;
    // console.log(username + " " + password)

    const user = await users.findBy({username}).first()
    // console.log(user)

    const passwordValid = await bcrypt.compare(password, user.password)
    // console.log(passwordValid)

    if(user && passwordValid) {
      // console.log(user + " " + passwordValid)
      // req.session.user = user; 
      const token = generateToken(user);
      res.status(200).json({
        token: token,
        message: `User ${username} authenticated.`
      })
    } else {
      res.status(401).json({message: 'Authentication Failed'})
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
