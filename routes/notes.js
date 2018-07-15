'use strict';

const express = require('express');

const router = express.Router();

const Note = require('../models/note');

const Tag = require('../models/tags');

const mongoose = require('mongoose');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId, tagId } = req.query;

  let filter = {};

  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: 'i' };
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  if (tagId) {
    filter.tag = tagId;
  }

  Note.find(filter)
    .populate('tags')
    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  Note
  .findById(req.params.id)
  .populate('tags')
  .then(note => {
    res.status(200).json(note.toObject())
  })
  .catch(err => {
    next(err);
  })
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags } = req.body;

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('folderId is not valid!');
    err.status = 400;
    return next(err);
  }

  // if (tagId && !mongoose.Types.ObjectId.isValid(tagId)) {
  //   const err = new Error('tagId is not valid!');
  //   err.status = 400;
  //   return next(err);
  // }

  const newNote = { title, content, folderId, tags };
  console.log(tags);
  console.log(newNote);

  Note
    .create(newNote)
    .then(note => {
      res.location(`${req.originalUrl}/${note.id}`)
      .status(201)
      .json(note)
    })
    .catch(err => {
      next(err);
    })
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

  const { folderId, tags } = req.body;

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('folderId is not valid!');
    err.status = 400;
    return next(err);
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'folderId', 'tags'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Note
    .findByIdAndUpdate(req.params.id,
      { $set: toUpdate },
      { new: true }
    )
    .then(updatedNote => res.status(204).json(updatedNote))
    .catch(err => {
      next(err);
    })
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  Note
  .findByIdAndRemove(req.params.id)
  .then(deletedNote => res.status(204).json(deletedNote).end())
  .catch(err => {
    next(err);
  })
})

module.exports = router;
