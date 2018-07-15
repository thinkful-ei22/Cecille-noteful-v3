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
    return Promise.all([
      Folder.insertMany(seedFolders),
      Folder.createIndexes()
    ])
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

  describe('GET /api/folders/:id', function () {
    it('should return correct folder', function () {
      let data;
      // 1) First, call the database
      return Folder.findOne()
        .then(_data => {
          data = _data;
          // 2) then call the API with the ID
          return chai.request(app).get(`/api/folders/${data.id}`);
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

  describe('POST /api/folders', function () {
    it('should create and return a new folder when provided valid data', function () {
      const newItem = {
        'name': 'Travel'
      };

      let body;
      // 1) First, call the API
      return chai.request(app)
        .post('/api/folders')
        .send(newItem)
        .then(function (res) {
          body = res.body;
          expect(res).to.have.status(201);
          //expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.a('object');
          expect(body).to.have.keys('id', 'name', 'createdAt', 'updatedAt');
          // 2) then call the database
          return Folder.findById(body.id);
        })
        // 3) then compare the API response to the database results
        .then(data => {
          expect(body.id).to.equal(data.id);
          expect(body.name).to.equal(data.name);
          expect(new Date(body.createdAt)).to.eql(data.createdAt);
          expect(new Date(body.updatedAt)).to.eql(data.updatedAt);
        });
    });
  });

  describe('PUT /api/folders/:id', function() {
  it('should update a folder when provided an id', function () {
    const updateData = {
      name: "Travel"
    };

    return Folder
      .findOne()
      .then(function(folder) {
        updateData.id = folder.id;

        return chai.request(app)
          .put(`/api/folders/${folder.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);

        return Folder.findById(updateData.id)
      })
      .then(function(folder) {
        expect(folder.name).to.equal(updateData.name)
      })
  })
})

describe('DELETE /api/folders', function () {
  it('should delete a folder when provided an id', function () {
    let folder;

    return Folder
      .findOne()
      .then(function(_folder) {
        folder = _folder;
        return chai.request(app)
          .delete(`/api/folders/${folder.id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
        return Folder.findById(folder.id);
      })
      .then(function(_folder) {
        expect(_folder).to.be.null;
      })
  })
})

});
