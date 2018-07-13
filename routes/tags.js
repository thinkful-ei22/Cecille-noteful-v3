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

module.exports = router;
