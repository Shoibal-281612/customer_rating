const express = require('express');
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const router = express.Router();

router.use(auth);
router.use(role('admin'));

router.get('/dashboard/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.get('/stores', adminController.getAllStores);
router.post('/stores', adminController.createStore);

module.exports = router;