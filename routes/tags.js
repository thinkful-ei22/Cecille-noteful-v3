'use strict';

const express = require('express');

const router = express.Router();

const Tag = require('../models/tags');

const Note = require('../models/note');

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

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Tag
    .create({
      name: name
    })
    .then(newTag => res.status(201).json(newTag))
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });
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

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Tag
  .findByIdAndRemove(id)
  .then(() => {
    return Note.updateMany(
      { tags: id },
      { $pull: {tags: id} }
    );
  })
  .then(() => {
    res.status(204).end();
  })
  .catch(err => {
    next(err);
  })
})

module.exports = router;
