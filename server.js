require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session')
const SECRET_SESSION = process.env.SECRET_SESSION;
const passport = require('./config/ppConfig')
const flash = require('connect-flash')

const isLoggedIn = require('./middleware/isLoggedIn')

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);


app.use(session({
  secret: SECRET_SESSION, // secret: What we actually giving the user to use our site/session cookie
  resave: false, // resave: Save the session even if it's modified, make this false
  saveUninitialized: true // saveUninitialized if we have a new session, we'll save it, therefore
}))
// initialize passport and run session as middleware
app.use(passport.initialize());
app.use(passport.session());

// flash create temporary messages
app.use(flash());

// middleware to have our messages accessible for every view
app.use((req,res,next)=> {
  // console.log(req.flash());
  // before every route, we will attached our current user to res.local
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});


app.get('/', (req, res) => {
  console.log(res.locals.alerts)
  res.render('index', { alerts: res.locals.alerts });
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${port} 🎧`);
});

module.exports = server;
