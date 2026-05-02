const router = require('express').Router();
const c = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/analytics', protect, adminOnly, c.getAnalytics);
router.get('/users',     protect, adminOnly, c.getUsers);
module.exports = router;
