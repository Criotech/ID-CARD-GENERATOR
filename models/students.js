let mongoose = require("mongoose");

let Schema = mongoose.Schema;


let studentSchema = new Schema({
    passport: {type: String},
    studentName: {type: String},
    reg: {type: String},
    class: {type: String},
    gender: {type: String},
    role: {type: String},
    email:{type: String}
})

module.exports = mongoose.model("Student", studentSchema)