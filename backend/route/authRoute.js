const express = require('express');
const { register, login, changePassword } = require('../controllers/authController');
const { validateRegistration } = require('../utils/validators');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.put('/change-password', auth, changePassword);

module.exports = router;