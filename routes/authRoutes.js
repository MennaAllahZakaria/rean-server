const express = require('express');
const { signup, login, refresh, logout, getAllUsers, updateUser, getUserProfile, deleteUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get("/refresh",refresh);
router.post("/logout",logout);
router.get('/users', protect, admin, getAllUsers);
router.put('/update', protect, updateUser);
router.delete('/delete/:id', protect, deleteUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
