const router = require('express').Router();

const controllers = require('../../controllers/home/home');

router.get('/', controllers.getHome);
router.get('/customers', controllers.getCustomers);
router.post('/permissions', controllers.customerPermissions);
router.post('/update', controllers.updatePermissions);

module.exports = router;