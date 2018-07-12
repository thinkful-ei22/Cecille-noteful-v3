'use strict';

const express = require('express');

const router = express.Router();

const Folder = require('../models/folder');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  Folder
  .find()
  .then(folders => res.status(200).json(folders))
  .catch(err => {
    next(err);
  })
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   const err = new Error('Id is not valid!');
  //   err.status = 400;
  //   return next(err);
  // }

  Folder
  .findById(id)
  .then(folder => {
    res.status(200).json(folder)
  })
  .catch(err => {
    next(err);
  })
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { name } = req.body;

  // if(!mongoose.Types.String.isValid(name)) {
  //   const err = new Error('Name is not valid!');
  //   err.status = 400;
  //   return next(err);
  // }

  Folder
    .create({
      name: req.body.name
    })
    .then(newFolder => res.status(201).json(newFolder))
    .catch(err => {
      next(err);
    })
});

module.exports = router;
