const express = require('express');

const router  = express.Router();

const authRoutes = require('./auth/authRoutes');
const userRoutes = require('./user/userRoutes');
const adminRoutes = require('./admin/adminRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;