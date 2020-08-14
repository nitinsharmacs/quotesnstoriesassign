const router = require('express').Router();
const { body } = require('express-validator/check');

const controllers = require('../../controllers/auth/auth');

router.get('/login', controllers.getLogin);
router.get('/signup', controllers.getSignup);
router.get('/logout', controllers.logout);
router.post('/login', controllers.postLogin);
router.post('/signup', [body('email').isEmail().normalizeEmail().withMessage('Invalid Email'), body('password').isLength({min:5, max:12}).withMessage('Password must have size between 5 and 12 letters!')] ,controllers.postSignup);


module.exports = router;