const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

console.log(MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    const searchTerm = 'Lady Gaga';
    let filter = {};

    if (searchTerm) {
      filter.title = { $regex: searchTerm };
    }
    // return Note.findById('5b450cfeabfbfc3356ad0017');
    //return Note.find(filter).sort({ updatedAt: 'desc' });
    // return Note.create({
    //   title: 'My Shiba Miko',
    //   content: 'Has a Curly Tail'
    // })
    // return Note.findByIdAndUpdate('5b450cfeabfbfc3356ad0017',
    //   { title: 'My Labrador Max', content: 'Has a Straight Tail'},
    //   { new: true }
    // )
    return Note.findByIdAndRemove('5b450cfeabfbfc3356ad0017')
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
