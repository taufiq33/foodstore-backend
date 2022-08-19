const router = require('express').Router();
const multer = require('multer');
const controller = require('./controller');

router.get('/orders', controller.index);
router.post('/orders', multer().none(), controller.store);

module.exports = router;
