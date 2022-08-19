const router = require('express').Router();
const controller = require('./controller');

router.get('/carts', controller.index);
router.put('/carts', controller.update);

module.exports = router;