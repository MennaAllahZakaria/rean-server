const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');



// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage });


const createCourse = async (req, res) => {
  const { title, description, image, category, price, learned } = req.body;
  const video = req.file.path.replace(/\\/g, '/');

  try {

    const courseExists = await Course.findOne({ title });
    if (courseExists) {
      return res.status(400).json({ message: 'Course already exists' });
    }


    const course = new Course({ title, description, image, category, price , video, learned ,instructor: req.user.id});
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, image, category ,price, learned} = req.body;
    let video = req.file ? req.file.path.replace(/\\/g, '/') : null;
  
    try {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

        // Check if the user is the instructor or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }
  
      
    course.title = title || course.title;
    course.description = description || course.description;
    course.image = image || course.image;
    course.category = category || course.category;
    course.price = price || course.price;
    if (video) course.video = video; 
      
  
      await course.save();
      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


const deleteCourse = async (req, res) => {
    const { id } = req.params;
  
    try {
        const course = await Course.findByIdAndDelete(id);
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


// Get course by ID
const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
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