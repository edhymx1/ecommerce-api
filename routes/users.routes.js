const { Router } = require('express');
const { signUp, signIn } = require('../controllers/users.controller');

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);

module.exports = router;
