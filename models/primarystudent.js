let mongoose = require("mongoose");

let Schema = mongoose.Schema;


let primarystudentSchema = new Schema({
    passport: {type: String},
    studentName: {type: String},
    reg: {type: String},
    role: {type: String},
    email:{type: String},
    sign: {type: String},
})

module.exports = mongoose.model("Primarystudent", primarystudentSchema)