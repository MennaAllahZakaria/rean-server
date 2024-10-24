
const express = require('express');
const { purchaseCourse, getPurchasedCourses, createPaymentIntent, logAccessedCourse, getAccessedCourses } = require('../controllers/purchaseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/purchase/:courseId', protect, purchaseCourse);
router.get('/my-courses', protect, getPurchasedCourses);
router.post('/payment', protect, createPaymentIntent); 
router.post('/log-access/:courseId', protect, logAccessedCourse);
router.get('/my-accessed-courses', protect, getAccessedCourses);

module.exports = router;