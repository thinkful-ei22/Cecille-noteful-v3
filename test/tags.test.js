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

  describe('GET /api/tags/:id', function () {
    it('should return correct tag', function () {
      let data;
      // 1) First, call the database
      return Tag.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app).get(`/api/tags/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('name', 'id', 'createdAt', 'updatedAt');

          // 3) then compare database results to API response
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  })

  describe('POST /api/tags', function () {
    it('should create and return a new tag when provided valid data', function () {
      const newItem = {
        'name': 'Outlier'
      };

      let res;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/tags')
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          //expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Tag.findById(res.body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('PUT /api/tags/:id', function() {
  it('should update tag name when provided an id', function () {
    const updateData = {
      name: "Unknown"
    };

    return Tag
      .findOne()
      .then(function(tag) {
        updateData.id = tag.id;

        return chai.request(app)
          .put(`/api/tags/${tag.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);

        return Tag.findById(updateData.id)
      })
      .then(function(tag) {
        expect(tag.name).to.equal(updateData.name)
      })
  })
})

});
