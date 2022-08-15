const router = require('express').Router();
const multer = require('multer');
const controller = require('./controller');

router.post('/deliveryaddress', multer().none(), controller.store);
router.put('/deliveryaddress/:deliveryAddressId', multer().none(), controller.update);
router.delete('/deliveryaddress/:deliveryAddressId', controller.destroy);
router.get('/deliveryaddress', controller.index);

module.exports = router;