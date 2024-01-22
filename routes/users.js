var express = require('express');
var router = express.Router();

// Require controller modules.
const user_controller = require('../controllers/userController');

// GET users listing
router.get('/', user_controller.user_list);

module.exports = router;
