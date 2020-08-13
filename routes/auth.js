const express = require('express');
const router = express.Router();
const db = require('../models');
const { response } = require('express');
const passport = require('../confing/ppConfig.js');
const { authenticate } = require('passport');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/signup', (req,res) => {
  //console.log(req.body);
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user,created])=> {
    if(created) {
      // if created, success and redirect to home
      res.redirect('/')

    } else {
      // email already exists
      res.redirect('/auth/signUp')
    }

  })
  .catch(error=> {
    console.log('Error',error)
    res.redirect('/auth/signup')
  })


})

router.post('/login', passport authenticate('local'), {
  successRedirect: '/',
  faliureRedirect: '/auth/login'.
})

module.exports = router;
