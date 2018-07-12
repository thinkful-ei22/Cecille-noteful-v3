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

module.exports = router;
