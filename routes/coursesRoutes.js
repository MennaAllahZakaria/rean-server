const express = require('express');
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse, getCoursesByInstructor } = require('../controllers/coursesController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/', getCourses);


router.get('/:id', getCourseById);


router.post('/', protect, createCourse);


router.put('/:id', protect, updateCourse);


router.delete('/:id', protect, deleteCourse);

router.get('/instructor/:id', getCoursesByInstructor);

module.exports = router;