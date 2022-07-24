const os = require('os');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: os.tmpdir() })

const ProductController = require('./controller');
const policyFor = require('../policy');

router.use('/products', (request, response, next) => {
  console.log('router level middleware ... product');
  let policy = policyFor(request.user);
  let condition = policy.can('read', 'Product')
    && policy.can('create', 'Product')
    && policy.can('delete', 'Product')
    && policy.can('update', 'Product');
  if(!condition) {
    return response.json({
      error: 1,
      message: 'forbidden to access Product resource'
    });
  }

  next();
})

router.get('/products', ProductController.index);
router.get('/products/:productId', ProductController.single);
router.post('/products', upload.single('image'), ProductController.store);
router.put('/products/:productId', upload.single('image'), ProductController.update);
router.delete('/products/:productId', ProductController.deleteProduct);

module.exports = router;