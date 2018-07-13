const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Tag = require('../models/tags');

const seedTags = require('../db/seed/tags');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Hook Functions', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Tag.insertMany(seedTags);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/tags', function () {
    it('should return all tags', function () {
      let res;
      return chai.request(app)
        .get(`/api/tags`)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.length.of.at.least(1);
          return Tag.count();
        })
        .then(function(count) {
          expect(res.body).to.have.length(count);
        })
    })
  })

});
