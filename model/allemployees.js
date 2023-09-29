const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    employeeName : {
        type:String,
        required:true
    },
    employeeId : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    employeeType : {
        type:String,
        required:true
    },
    phoneNumber : {
        type:String,
        required:true
    },
    designation : {
        type:String,
        required:true
    },
    aadharNumber : {
        type:String,
        required:true
    },
    joiningDate : {
        type:Date,
        required:true
    },
    trainingCourse : {
        type:String
    },
    trainerName : {
        type:String
    },
    feedbackByHR: {
      type: String,
    },
    weeklyFeedbackByHR: [
        {
          dateRange: {
            type: String,
          },
          feedBack: {
            type: String,
          }
        }]
})



const employesData = mongoose.model("allemployees", productSchema);
module.exports = employesData;