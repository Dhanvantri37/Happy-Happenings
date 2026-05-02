const router = require('express').Router();
const c = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');
router.post('/',                    protect, c.createBooking);
router.get('/user',                 protect, c.getUserBookings);
router.get('/all',                  protect, adminOnly, c.getAllBookings);
router.post('/validate/:bookingId', protect, adminOnly, c.validateTicket);
router.put('/cancel/:id',           protect, c.cancelBooking);
module.exports = router;
