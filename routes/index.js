const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require('bcrypt');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const loginCheck = () => {
  return (req, res, next) => {
    // check for a logged in user
    if (req.session.user) {
      next()
    } else {
      res.redirect('/login')
    }
  }
}


router.get("/profile", loginCheck(), (req, res, next) => {
  // this is how we can set a cookie
  res.cookie('ourCookie', 'hello node')
  console.log('this is our cookie: ', req.cookies)
  // to clear a cookie
  res.clearCookie('ourCookie');
  // we retrieve the logged in user from the session
  const loggedInUser = req.session.user
  res.render("profile", { user: loggedInUser });
});

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.get("/login", (req, res, next) => {
	res.render("login");
});

router.post('/signup', (req, res, next) => {
  const {username, password} = req.body
  if (password.length <4) {
    res.render('signup', {message: 'Your password should be more than 4 characthers FFS'})
    return
  }
  if(username.length ===0) {
    res.render('signup', {message: 'You have to choose a yousername'})
    return
  }
  User.findOne({username: username})
  .then(userFromDB => {
    if(userFromDB !== null) {
      res.render('signup', {message: 'Your username is already taken'})
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt)
      User.create({username: username, password: hash})
      .then(createUser => {
        res.redirect('/profile')
      })
      .catch(err => next(err))
    }
  })
})

router.post('/login', (req, res, next) => {
	const { username, password } = req.body;
	// do we have a user with that username in the database
	User.findOne({ username: username })
		.then(userFromDB => {
			if (userFromDB === null) {
				// username is not correct -> show login 
				res.render('login', { message: 'invalid credentials' })
				return
			}
			// username is correct
			// check the password against the hash in the database
			// compareSync() -> true or false
			if (bcrypt.compareSync(password, userFromDB.password)) {
				// it matches -> credentials are correct -> user get's logged in
				// req.session.<some key (usually 'user')>
				req.session.user = userFromDB
				res.redirect('/profile')
			} else {
				// password is not correct -> show login again
				res.render('login', { message: 'invalid credentials' })
			}
		})
});

router.get('/logout', (req, res, next) => {
	req.session.destroy(err => {
		if (err) {
			// if we have an error -> pass to the error handler
			next(err)
		} else {
			// success
			res.redirect('/')
		}
	})
});

router.get('/main', loginCheck(), (req,res,next) => {
  const loggedInUser = req.session.user
  res.render('main', {user: loggedInUser})
})

module.exports = router;