let mongoose = require("mongoose");

let Schema = mongoose.Schema;


let primaryadminSchema = new Schema({
    passport: {type: String},
    schoolName: {type: String},
    address: {type: String},
    validity: {type: String},
    motto: {type: String},
    color: {type: String},
    sign: {type: String},
    role: {type: String},
    email:{type: String}
})

module.exports = mongoose.model("Primaryadmin", primaryadminSchema)