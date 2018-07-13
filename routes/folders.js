'use strict';

const express = require('express');

const router = express.Router();

const Folder = require('../models/folder');

const mongoose = require('mongoose');

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
      if (err.code === 11000) {
        err = new Error('The folder name already exists');
        err.status = 400;
      }
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);

    return res.status(400).json({message: message});
  }

  const { name } = req.body;
  const toUpdate = { name: null };

  if (name) {
    toUpdate.name = name;
  }

  Folder
    .findByIdAndUpdate(req.params.id,
      { $set: toUpdate },
      { new: true }
    )
    .then(updatedFolder => res.status(204).json(updatedFolder))
    .catch(err => {
      next(err);
    })
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  Folder
  .findByIdAndRemove(req.params.id)
  .then(deletedFolder => res.status(204).json(deletedFolder).end())
  .catch(err => {
    next(err);
  })
})

module.exports = router;
