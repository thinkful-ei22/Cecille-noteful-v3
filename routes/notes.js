'use strict';

const express = require('express');

const router = express.Router();

const Note = require('../models/note');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  Note
  .find()
  .then(notes => res.json(notes))
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  Note
  .findById(req.params.id)
  .then(note => {
    res.json(note)
  })
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  Note
    .create({
      title: req.body.title,
      content: req.body.content
    })
    .then(newNote => res.json(newNote))
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {

  console.log('Update a Note');
  res.json({ id: 1, title: 'Updated Temp 1' });

});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {

  console.log('Delete a Note');
  res.status(204).end();
});

module.exports = router;