const router = require('express').Router();
const multer = require('multer');
const TagController = require('./controller');

router.post('/tag', multer().none(), TagController.store);
router.get('/tag', TagController.index);
router.get('/tag/:tagId', TagController.single);
router.put('/tag/:tagId', multer().none(), TagController.update);
router.delete('/tag/:tagId', TagController.deleteTag);

module.exports = router;