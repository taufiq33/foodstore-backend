const router = require('express').Router();
const multer = require('multer');
const CategoryController = require('./controller');

router.post('/categories', multer().none(), CategoryController.store)
router.get('/categories', CategoryController.index);
router.get('/categories/:categoryId', CategoryController.single);
router.put('/categories/:categoryId', multer().none(), CategoryController.update);
router.delete('/categories/:categoryId', CategoryController.deleteCategory);

module.exports = router;