const router = require('express').Router();
const multer = require('multer');
const TagController = require('./controller');
const policyFor = require('../policy');

router.use('/tag', (request, response, next) => {
  console.log('router level middleware ... tag');
  let policy = policyFor(request.user);
  let condition = policy.can('read', 'Tag')
    && policy.can('create', 'Tag')
    && policy.can('delete', 'Tag')
    && policy.can('update', 'Tag');
  console.log(condition);
  if(!condition) {
    return response.json({
      error: 1,
      message: 'forbidden to access Tag resource'
    });
  }

  next();
})

router.post('/tag', multer().none(), TagController.store);
router.get('/tag', TagController.index);
router.get('/tag/:tagId', TagController.single);
router.put('/tag/:tagId', multer().none(), TagController.update);
router.delete('/tag/:tagId', TagController.deleteTag);

module.exports = router;