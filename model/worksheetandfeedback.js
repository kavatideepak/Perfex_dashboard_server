const mongoose = require("mongoose");

const worksheetSchema = new mongoose.Schema({
  monday: {
    type: String,
  },
  tuesday: {
    type: String,
  },
  wednesday: {
    type: String,
  },
  thursday: {
    type: String,
  },
  friday: {
    type: String,
  },
});

const worksheetandFeedbackSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  employeeType:{
    type: String,
    required: true,
  },

  weekperiod: [
    {
      dateRange: {
        type: String,
      },
      trainerName: {
        type: String,
      },
      status: {
        type: String,
      },
      feedbackByEmployee: {
        type: String,
      },
      weekPerformance : {
        type : String
      },
      feedbackByTrainer: {
        type: String,
      },
      courseName : {
        type: String,
      },
      taskStatus : {
        type: String,
      },
      worksheets: worksheetSchema,
    },
  ],
});

const employesworksheetFeedback = mongoose.model(
  "worksheetFeedback",
  worksheetandFeedbackSchema
);
module.exports = employesworksheetFeedback;
