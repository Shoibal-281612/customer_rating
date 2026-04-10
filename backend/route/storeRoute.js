const express = require('express');
const { getStores, submitRating } = require('../controllers/storeController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { validateRating } = require('../utils/validators');
const router = express.Router();

router.get('/', auth, getStores);
router.post('/:storeId/ratings', auth, role('user'), validateRating, submitRating);

module.exports = router;