const express = require('express');
const Course = require('../models/Course'); 
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();


router.post('/', protect, (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'instructor') {
    return next();
  } 
  return res.status(403).json({ message: 'Not authorized' });
}, upload.single('video'), async (req, res) => {
  const { title, description, image, category, price, learned } = req.body;
  const video = req.file.path.replace(/\\/g, '/');

  try {
    const courseExists = await Course.findOne({ title });
    if (courseExists) {
      return res.status(400).json({ message: 'Course already exists' });
    }

    const course = new Course({
      title,
      description,
      image,
      category,
      price,
      video,
      learned,
      instructor: req.user.id 
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put('/:id', protect, upload.single('video'), async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  // Check if the user is authorized to update the course
  if (req.user.role === 'admin' || course.instructor.toString() === req.user.id) {
    return next(); // Pass control to the next function (updateCourse)
  }

  return res.status(403).json({ message: 'Not authorized to update this course' });
}, async (req, res) => {
  const { title, description, image, category, price, learned } = req.body;
  
  try {
    const course = await Course.findById(req.params.id);

    // Ensure instructor remains the same
    const instructor = course.instructor; // Keep the existing instructor

    // Update the fields with new values or keep the existing ones
    course.title = title || course.title;
    course.description = description || course.description;
    course.image = image || course.image;
    course.category = category || course.category;
    course.price = price || course.price;
    course.learned = learned || course.learned;

    // Keep the existing instructor value
    course.instructor = instructor; // Ensure the instructor is set correctly

    // Update the video if a new one is uploaded
    if (req.file) {
      course.video = req.file.path.replace(/\\/g, '/'); // Replace backslashes with slashes
    }

    await course.save(); // Save the updated course
    res.status(200).json(course); // Return the updated course
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role === 'admin' || course.instructor.toString() === req.user.id) {
      await Course.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: 'Course removed' });
    }

    return res.status(403).json({ message: 'Not authorized to delete this course' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/search/:query', async (req, res) => {
  try {
    const courses = await Course.find({ title: new RegExp(req.params.query, 'i') });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get courses by instructor ID
router.get('/instructor/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const courses = await Course.find({ instructor: id });
    if (!courses.length) {
      return res.status(404).json({ message: 'No courses found for this instructor' });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




module.exports = router;