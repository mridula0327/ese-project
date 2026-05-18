const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
  },

  department: {
    type: String,
    default: "General",
  },

  skills: {
    type: [String],
    default: [],
  },

  performanceScore: {
    type: Number,
    default: 0,
  },

  experience: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Candidate", CandidateSchema);