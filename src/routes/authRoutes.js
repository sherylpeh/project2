const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, password, name, dateOfBirth, gender, zodiacSign } = req.body;
		
  try {
    const user = new User({ username, password, name, dateOfBirth, gender, zodiacSign });
    await user.save();
	
	//res.send('You made a post request');
  
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token }); 
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).send({ error: 'Must provide username and password' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(422).send({ error: 'Invalid username or username' });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or username' });
  } 
}); 

module.exports = router;