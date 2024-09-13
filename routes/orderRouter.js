const express = require('express')
const router = express.Router()
const orderController = require('./../controllers/orderController');

router.get('/', orderController.getAllOrdersForAGroup);
router.post('/claim', orderController.makeAClaimForAnOrderItemBulk);
router.post('/', orderController.createAnOrder);

module.exports = router;