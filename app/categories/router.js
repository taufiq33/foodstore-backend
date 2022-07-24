const router = require('express').Router();
const multer = require('multer');
const CategoryController = require('./controller');
const policyFor = require('../policy');

router.use('/categories', (request, response, next) => {
  console.log('router level middleware ... cateogory');
  let policy = policyFor(request.user);
  let condition = policy.can('read', 'Category')
    && policy.can('create', 'Category')
    && policy.can('delete', 'Category')
    && policy.can('update', 'Category');
  if(!condition) {
    return response.json({
      error: 1,
      message: 'forbidden to access category resource'
    });
  }

  next();
})

router.post('/categories', multer().none(), CategoryController.store)
router.get('/categories', CategoryController.index);
router.get('/categories/:categoryId', CategoryController.single);
router.put('/categories/:categoryId', multer().none(), CategoryController.update);
router.delete('/categories/:categoryId', CategoryController.deleteCategory);

module.exports = router;