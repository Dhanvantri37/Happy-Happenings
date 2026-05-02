const router = require('express').Router();
const c = require('../controllers/wishlistController');
const { protect } = require('../middleware/auth');
router.get('/',         protect, c.getWishlist);
router.post('/toggle',  protect, c.toggleWishlist);
module.exports = router;
