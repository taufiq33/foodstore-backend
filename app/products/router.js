const os = require('os');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: os.tmpdir() })

const ProductController = require('./controller');

router.get('/products', ProductController.index);
router.get('/products/:productId', ProductController.single);
router.post('/products', upload.single('image'), ProductController.store);
router.put('/products/:productId', upload.single('image'), ProductController.update);
router.delete('/products/:productId', ProductController.deleteProduct);

module.exports = router;