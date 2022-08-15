const router = require('express').Router();
const multer = require('multer');
const controller = require('./controller');

router.post('/deliveryaddress', multer().none(), controller.store);

module.exports = router;