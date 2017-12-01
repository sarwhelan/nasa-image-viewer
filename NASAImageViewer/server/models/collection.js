var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CollectionSchema = new Schema({
    owner: String,
    name: String,
    description: String,
    visibility: String,
    imgLinks: [String],
    rating: Number
});

module.exports = mongoose.model('Collection', CollectionSchema);
