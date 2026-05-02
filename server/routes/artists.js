const router = require('express').Router();
const c = require('../controllers/artistController');
const { protect, adminOnly } = require('../middleware/auth');
router.get('/',      c.getArtists);
router.get('/:id',   c.getArtist);
router.post('/',     protect, adminOnly, c.createArtist);
router.put('/:id',   protect, adminOnly, c.updateArtist);
router.delete('/:id',protect, adminOnly, c.deleteArtist);
module.exports = router;
