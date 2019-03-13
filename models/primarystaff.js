let mongoose = require("mongoose");

let Schema = mongoose.Schema;


let primarystaffSchema = new Schema({
    passport: {type: String},
    staffName: {type: String},
    reg: {type: String},
    position: {type: String},
    gender: {type: String},
    role: {type: String},
    email:{type: String},
    sign: {type: String},
})

module.exports = mongoose.model("Primarystaff", primarystaffSchema)