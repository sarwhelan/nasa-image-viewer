var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LoggerSchema = new Schema({
    complaintBy: String,
    dateOfComplaint: String,
    complaintType: String,
    collectionID: String,
    accusedUser: String
});

module.exports = mongoose.model('Logger', LoggerSchema);
