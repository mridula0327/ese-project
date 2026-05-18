const express = require("express");

const router = express.Router();

const Candidate = require("../models/Candidate");



// ADD EMPLOYEE
router.post("/", async (req, res) => {

  try {

    const employee = new Candidate({
  name: req.body.name,
  email: req.body.email,
  department: req.body.department || "General",
  skills: req.body.skills || [],
  performanceScore: req.body.performanceScore || 0,
  experience: req.body.experience || 0,
});

    await employee.save();

    res.status(201).json({
      message: "Employee Added Successfully",
      employee,
    });

  } catch (error) {

  console.log("BACKEND ERROR:");
  console.log(error);

  res.status(500).json({
    message: error.message,
  });
  }
});




// GET ALL EMPLOYEES
router.get("/", async (req, res) => {

  try {

    const employees = await Candidate.find();

    res.json(employees);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});




// SEARCH EMPLOYEE BY DEPARTMENT
router.get("/search", async (req, res) => {

  try {

    const { department } = req.query;

    const employees = await Candidate.find({
      department: department,
    });

    res.json(employees);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});




// DELETE EMPLOYEE
router.delete("/:id", async (req, res) => {

  try {

    await Candidate.findByIdAndDelete(req.params.id);

    res.json({
      message: "Employee Deleted Successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});



module.exports = router;