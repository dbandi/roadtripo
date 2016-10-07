// app/routes.js
module.exports = function(app, passport, path, express) {

    // =====================================
	// HOME PAGE ===========================
	// =====================================
    app.get('/', function(req, res, next) {
        res.render('index.html');
    });


	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
    app.get('/login', function(req, res) {
        res.render('login.html');
    });

	// process the login form
    app.post('/login', passport.authenticate('local-login', {
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
