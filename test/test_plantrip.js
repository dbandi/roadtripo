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

  // Test Plantrip

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

  // Test Foursquare

  describe('/GET places?source=Chicago&destination=Moline', () => {
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
