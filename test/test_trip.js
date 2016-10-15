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

var user1 = request.agent();

    user1
    .post('http://localhost:3000/login')
    .send({ username: 'user@gmail.com', password: 'user' })
    .end(function(err, res) {
        // user1 will manage its own cookies
        // res.redirects contains an Array of redirects          
    });

  /*
  * Test the /GET route
  */
  describe('/GET gettrips', () => {
      it('it should GET all the gettrips', (done) => {
        chai.request(app)
            .get('/gettrips')
            .end((err, res) => {
                //console.log(res);
                res.should.have.status(200);
                res.body.should.be.a('object');
                //res.body.length.should.be.eql(0);
              done();
            });
      });
  });
