const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_name: { type: String, required: true, maxLength: 100 },
});

module.exports = mongoose.model('User', UserSchema);
