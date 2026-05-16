const express = require("express");

const router = express.Router();

const Candidate = require("../models/Candidate");

router.post("/", async (req, res) => {
  try {

    const { requiredSkills, minExperience } = req.body;

    const candidates = await Candidate.find();

    const matchedCandidates = candidates.map((candidate) => {

      const matchedSkills = candidate.skills.filter((skill) =>
        requiredSkills.includes(skill)
      );

      const skillScore =
        matchedSkills.length / requiredSkills.length;

      const experienceScore =
        candidate.experience >= minExperience ? 1 : 0;

      const totalScore = (skillScore * 0.8) + (experienceScore * 0.2);

      return {
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        experience: candidate.experience,
        matchedSkills,
        matchScore: (totalScore * 100).toFixed(2) + "%",
      };
    });

    matchedCandidates.sort(
      (a, b) =>
        parseFloat(b.matchScore) - parseFloat(a.matchScore)
    );

    res.json(matchedCandidates);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;