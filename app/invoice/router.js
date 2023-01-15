const router = require('express').Router();
const controller = require('./controller');

router.get('/invoices/:order_id', controller.show);
router.get('/invoices/:order_id/initiate_payment', controller.initiatePayment);

module.exports = router;
