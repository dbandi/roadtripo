//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var passport = require('passport');
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var request = require('superagent');
var should = chai.should();

chai.use(chaiHttp);
chai.use(require('chai-passport-strategy'));

// =====================================
// Test Plantrip : Google Route ========
// =====================================

  describe('/GET plantrip?source=Chicago&destination=Moline', () => {
      it('it should GET latitude longitude between Source and Destination', (done) => {
        chai.request(app)
            .get('/plantrip?source=Chicago&destination=Moline')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                for (var i = 0; i < Object.keys(res.body).length; i++) {
                    res.body[i].should.have.property([ 'city' ]);
                    res.body[i].should.have.property([ 'lat' ]);
                    res.body[i].should.have.property([ 'lng' ]);
                    res.body[i].should.have.property([ 'placeId' ]);
                }
              done();
            });
      });
  });

  // =====================================
  // Test Foursquare API =================
  // =====================================

  describe('/GET places?placetypes=Popular&lat=41.8781&lng=-87.6298', () => {
      it('it should GET Popular places around Chicago', (done) => {
        chai.request(app)
            .get('/places?placetypes=Popular&lat=41.8781&lng=-87.6298')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                var total_response = res.body.response.groups[0].items;
                for (var i = 0; i < Object.keys(total_response).length; i++) {
                    total_response[i].venue.should.have.property([ 'id' ]);
                    total_response[i].venue.should.have.property([ 'name' ]);
                    total_response[i].venue.location.should.have.property([ 'lat' ]);
                    total_response[i].venue.location.should.have.property([ 'lng' ]);
                }
              done();
            });
      });
  });

  // =====================================
  // Test Yelp API =======================
  // =====================================

  describe('/GET placefilter?placetypes=food&lat=41.8781&lng=-87.6298', () => {
      it('it should GET restaurants around Chicago', (done) => {
        chai.request(app)
            .get('/placefilter?placetypes=food&lat=41.8781&lng=-87.6298')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                var total_response = res.body.businesses;
                for (var i = 0; i < Object.keys(total_response).length; i++) {
                    total_response[i].should.have.property([ 'id' ]);
                    total_response[i].should.have.property([ 'name' ]);
                    total_response[i].location.coordinate.should.have.property([ 'latitude' ]);
                    total_response[i].location.coordinate.should.have.property([ 'longitude' ]);
                }
              done();
            });
      });
  });

  // =====================================
  // Test Gas Station API ================
  // =====================================

  /*describe('/GET gasprices?fueltype=reg&lat=41.8781&lng=-87.6298&radius=2&sort_by=distance', () => {
      it('it should GET gas prices around Chicago', (done) => {
        chai.request(app)
            .get('/gasprices?fueltype=reg&lat=41.8781&lng=-87.6298&radius=2&sort_by=distance')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');

                var total_response = res.body;
                for (var i = 0; i < Object.keys(total_response).length; i++) {
                    total_response[i].should.have.property([ 'id' ]).and.be.a.Number();
                    total_response[i].should.have.property([ 'station' ]);
                    total_response[i].should.have.property([ 'lat' ]);
                    total_response[i].should.have.property([ 'lng' ]);
                    total_response[i].should.have.property([ 'reg_price' ]);
                }
              done();
            });
      });
  });*/

  // =====================================
  // Test Airbnb API =====================
  // =====================================
  describe('/GET hotels?page=1&lat=41.8781&lng=-87.6298&check_in=07-03-2015&check_out=07-06-2015&guests=2', () => {
      it('it should GET hotel prices around Chicago', (done) => {
        chai.request(app)
            .get('/hotels?page=1&lat=41.8781&lng=-87.6298&check_in=07-03-2015&check_out=07-06-2015&guests=2')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                var total_response = res.body;
                for (var i = 0; i < Object.keys(total_response).length; i++) {
                    total_response[i].listing.should.have.property([ 'id' ]);
                    total_response[i].listing.should.have.property([ 'bedrooms' ]);
                    total_response[i].listing.should.have.property([ 'lat' ]);
                    total_response[i].listing.should.have.property([ 'lng' ]);
                    total_response[i].pricing_quote.rate.should.have.property([ 'amount' ]);
                }
              done();
            });
      });
  });
