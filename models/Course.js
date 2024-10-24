const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }, 
  category: { type: String, required: true }, 
  price: { type: Number, required: true },
  video: { type: String, required: true },
  learned: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
});


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;