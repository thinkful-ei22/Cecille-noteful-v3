const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Folder = require('../models/folder');

const seedFolders = require('../db/seed/folders');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Hook Functions', function() {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Folder.insertMany(seedFolders);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/folders', function () {
    it('should return all folders', function () {
      let res;
      return chai.request(app)
        .get(`/api/folders`)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.length.of.at.least(1);
          return Folder.count();
        })
        .then(function(count) {
          expect(res.body).to.have.length(count);
        })
    })
  })

});
