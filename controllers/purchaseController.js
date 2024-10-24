const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Course = require('../models/Course');

// Purchase a course
const purchaseCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id; // Get the user's ID from the token

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(userId);
    if (!user.purchasedCourses.includes(courseId)) {
      user.purchasedCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({ message: 'Course purchased successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get purchased courses for a user
const getPurchasedCourses = async (req, res) => {
  const userId = req.user.id; // Get the user's ID from the token

  try {
    const user = await User.findById(userId).populate('purchasedCourses');
    res.status(200).json(user.purchasedCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body; 

  try {
      const paymentIntent = await stripe.paymentIntents.create({
          amount, 
          currency: 'usd', 
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const logAccessedCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }

    // Check if the course is already logged
    if (!user.accessedCourses.includes(courseId)) {
      user.accessedCourses.push(courseId);
      await user.save();
    }

    res.status(200).json({ message: 'Course access logged successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAccessedCourses = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('accessedCourses');
    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }
    res.status(200).json(user.accessedCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { purchaseCourse, getPurchasedCourses, createPaymentIntent, logAccessedCourse, getAccessedCourses  };