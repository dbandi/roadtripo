//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var passport = require('passport');
var util = require('util');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var request = require('superagent');
var should = chai.should();
var BasicStrategy = require('passport-http').BasicStrategy
var AnonymousStrategy = require('passport-anonymous').Strategy;
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

chai.use(chaiHttp);
chai.use(require('chai-passport-strategy'));

var user1 = request.agent();
    // =====================================
    // Test Get Trips ======================
    // =====================================

  describe('Trip', function () {
      before(function(done) {
          user1
          .post('http://localhost:3000/login')
          .send({ username: 'admin@gmail.com', password: 'admin' })
          .end(function(err, res) {
              // user1 will manage its own cookies
              // res.redirects contains an Array of redirects
              app.use(cookieParser());
              app.use(passport.initialize());
              app.use(passport.session());
              return done();
          }).done();
        });
    });

    describe('/GET gettrips', () => {
        it('it should GET all the gettrips', (done) => {
          chai.request(app)
              .get('/gettrips')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                return done();
              });
        });
    });

    describe('/GET searchtrip', () => {
        it('it should GET all Phoenix trips', (done) => {
          chai.request(app)
              .get('/searchtrip?search=Phoenix')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body[0].should.have.property('trip_id');
                  res.body[0].should.have.property('trip_name');
                  res.body[0].trip_id.should.be.a.Number;
                  res.body[0].trip_name.should.be.a.String;
                return done();
              });
        });
    });

    describe('/GET gettriproute', () => {
        it('it should the trip Route where id is 1', (done) => {
          chai.request(app)
              .get('/gettriproute?trip_id=1')
              .end((err, res) => {                  
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body[0].should.have.property('trip_id');
                  res.body[0].should.have.property('trip_name');
                  res.body[0].trip_id.should.be.a.Number;
                  res.body[0].trip_name.should.be.a.String;
                  res.body[0].trip_id.should.equal(1);
                return done();
              });
        });
    });
