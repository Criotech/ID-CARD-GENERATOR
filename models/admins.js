let mongoose = require("mongoose");

let Schema = mongoose.Schema;


let adminSchema = new Schema({
    passport: {type: String},
    schoolName: {type: String},
    address: {type: String},
    validity: {type: String},
    caution: {type: String},
    sign: {type: String},
    role: {type: String},
    email:{type: String}
})

module.exports = mongoose.model("Admin", adminSchema)