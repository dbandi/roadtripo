// app/routes.js
module.exports = function(app, passport, path, express, cookieParser, cookieSession, bodyParser, FacebookStrategy, GooglePlusStrategy, TwitterStrategy) {

    // =====================================
	// HOME PAGE ===========================
	// =====================================
    app.get('/', function(req, res, next) {
        res.render('index.html');
    });

    // =====================================
	// Facebook ===========================
	// =====================================
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
         passport.authenticate('facebook', {
            failureRedirect: '/login' }),
            function(req, res) {                
                app.use(cookieParser());
                app.use(passport.initialize());
                app.use(passport.session());
                res.redirect('/');
    });

    // =====================================
	// Google ===========================
	// =====================================
    app.get('/auth/google',
          passport.authenticate('google', { failureRedirect: '/login' }),
          function(req, res) {
            res.redirect('/');
    });

    app.get('/auth/google/return',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
          res.redirect('/');
    });

    // =====================================
	// Twitter ===========================
	// =====================================
    app.get('/auth/twitter',
      passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      function(req, res) {
          app.use(cookieParser());
          app.use(passport.initialize());
          app.use(passport.session());
        res.redirect('/');
      });

    // =====================================
	// CHECK USER LOGGED IN ===========================
	// =====================================
    app.get('/getuserid', function(req, res, next) {
        if(typeof req.user != 'undefined'){
            res.send(req.user.id.toString());
        }
        else{
            res.send("unauthorized");
        }
    });


	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
    app.get('/login', function(req, res) {
        res.render('login.html');
    });

    app.post('/login', function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
          return res.send({ success : false, message : 'authentication failed' });
        }
      req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.send({ success : true, message : 'authentication succeeded', user_id : user.id });
      });
      })(req, res, next);
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
    app.get('/signup', function(req, res) {
     res.render('signup.html');
    });

	// process the signup form
    /*app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));*/
    app.post('/signup', function(req, res, next) {
      passport.authenticate('local-signup', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
          return res.send({ success : false, message : 'signup failed' });
        }
      req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.send({ success : true, message : 'signup succeeded', user_id : user.id });
      });
      })(req, res, next);
    });

	// =====================================
	// LOGOUT ==============================
	// =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
