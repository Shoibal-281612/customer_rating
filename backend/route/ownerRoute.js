const express = require('express');
const { getDashboard } = require('../controllers/ownerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.get('/dashboard', auth, role('store_owner'), getDashboard);

module.exports = router;