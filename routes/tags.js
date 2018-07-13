'use strict';

const express = require('express');

const router = express.Router();

const Tag = require('../models/tags');

const mongoose = require('mongoose');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  Tag
  .find()
  .sort({ name: 'asc' })
  .then(tags => res.status(200).json(tags))
  .catch(err => {
    next(err);
  })
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Id is not valid!');
    err.status = 400;
    return next(err);
  }

  Tag
  .findById(id)
  .then(tag => {
    res.status(200).json(tag)
  })
  .catch(err => {
    next(err);
  })
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { name, id } = req.body;
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('ID is not valid!');
    err.status = 400;
    return next(err);
  }

  const toUpdate = { name: null };

  if (name) {
    toUpdate.name = name;
  }

  Tag
    .findByIdAndUpdate(req.params.id,
      { $set: toUpdate },
      { new: true }
    )
    .then(updatedTags => res.status(204).json(updatedTags))
    .catch(err => {
      next(err);
    })
});

module.exports = router;
