const User = require('../models/user');
const asyncHandler = require('express-async-handler');

// Display list of all users.
exports.user_list = asyncHandler(async (req, res, next) => {
    const allUsers = await User.find({}, 'user_name');
    res.render('user_list', { user_list: allUsers });
});
