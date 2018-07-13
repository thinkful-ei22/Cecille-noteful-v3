'use strict';

const express = require('express');

const router = express.Router();

const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId } = req.query;

  let filter = {};

  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: 'i' };
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  Note.find(filter)
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
  .then(note => {
    res.status(200).json(note)
  })
  .catch(err => {
    next(err);
  })
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  Note
    .create({
      title: req.body.title,
      content: req.body.content,
      folderId: req.body.folderId
    })
    .then(newNote => res.status(201).json(newNote))
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

  const toUpdate = {};
  const updateableFields = ['title', 'content', 'folderId'];

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