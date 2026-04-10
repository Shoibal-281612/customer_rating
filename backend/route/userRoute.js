const express = require('express');
const { updatePassword } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.put('/password', auth, updatePassword);

module.exports = router;