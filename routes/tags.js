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

module.exports = router;
