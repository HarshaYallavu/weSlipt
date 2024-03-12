const express = require('express')
const router = express.Router()
const groupController = require('./../controllers/groupController')

router.post('/add', groupController.addNewGroup);
router.get('/', groupController.getUserGroups);
router.put('/addNewUser', groupController.addNewUserToGroup);

module.exports = router