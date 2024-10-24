const Course = require('../models/Course');
const multer = require('multer');

// Use memory storage to keep files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create course with uploaded video as a buffer
const createCourse = async (req, res) => {
  const { title, description, image, category, price, learned } = req.body;
  const videoBuffer = req.file ? req.file.buffer : null; // Get video buffer directly

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
      video: videoBuffer, // Save the buffer directly
      learned,
      instructor: req.user.id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course with uploaded video as a buffer
const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, image, category, price, learned } = req.body;
  const videoBuffer = req.file ? req.file.buffer : null; // Get video buffer directly

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is the instructor or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.image = image || course.image;
    course.category = category || course.category;
    course.price = price || course.price;
    if (videoBuffer) course.video = videoBuffer; // Update video only if provided

    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Other methods (deleteCourse, getAllCourses, getCourseById, searchCourses, getCoursesByInstructor) remain the same
const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is the instructor or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Convert the video buffer to base64 if it exists
    if (course.video) {
      const base64Video = course.video.toString('base64');
      course.video = `data:video/mp4;base64,${base64Video}`; // Set the base64 string to course.video
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const searchCourses = async (req, res) => {
  const { query } = req.params;

  try {
    const courses = await Course.find({ title: new RegExp(query, 'i') });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCoursesByInstructor = async (req, res) => {
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
};

module.exports = { createCourse, updateCourse, deleteCourse, getAllCourses, searchCourses, getCourseById, getCoursesByInstructor };
