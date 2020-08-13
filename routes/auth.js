const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig.js');
const flash = require('connect-flash');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  db.user.findOrCreate({
    where: { email: req.body.email },
    defaults: { 
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user, created]) => {
    if (created) {
      // if created, success and redirect to home
      console.log(`${user.name} was created`);
      // FLASH MESSAGE  
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account Created and logging in'
      })(req, res);
      // before passport authenicate
      // res.redirect('/');
    } else {
      // Email already exist
      console.log('Email already exist');
      // FLASH MESSAGE
      req.flash('Email already exists try again.')
      res.redirect('/auth/signup');
    }
  })
  .catch(error => {
    console.log('Error', error);
    req.flash(`Error, unfortunately...${error}`);
    res.redirect('/auth/signup');
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  successFlash: 'Successfully logged in, Welcome',
  failureRedirect: '/auth/login',
  failureFlash: 'Either email or password is incorrect. Please try again'
}))

router.get('/logout', (req,res)=> {
  req.logOut();
  // FLASH MESSAGE
  req.flash('Successfully logged out, see you soon.')
  res.redirect('/');
})


module.exports = router;
