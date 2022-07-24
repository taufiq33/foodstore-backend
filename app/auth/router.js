const router = require('express').Router();
const multer = require('multer');
const passport = require('passport');

const controller = require('./controller');

router.post('/register', multer().none(), controller.register);
router.post('/login', multer().none(), controller.login);

module.exports = router;