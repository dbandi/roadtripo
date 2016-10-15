// app/routes.js
module.exports = function(app, passport, path, express) {

    // =====================================
	// HOME PAGE ===========================
	// =====================================
    app.get('/', function(req, res, next) {
        res.render('index.html');
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

	// process the login form
    /*app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
              console.log("Success");
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });*/

    app.post('/login', function(req, res, next) {
      passport.authenticate('local-login', function(err, user, info) {
        if (err) {
          return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
          return res.send({ success : false, message : 'authentication failed' });
        }
        /*req.login(user, loginErr => {
          if (loginErr) {
            return next(loginErr);
          }
          console.log(user);
          return res.send({ success : true, message : 'authentication succeeded', user_id : user.id });
      });*/
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
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

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
