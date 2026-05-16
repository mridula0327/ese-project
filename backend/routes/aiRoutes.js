const express = require("express");
const axios = require("axios");

const router = express.Router();

const Candidate = require("../models/Candidate");

router.post("/shortlist", async (req, res) => {

  try {

    const { requiredSkills, minExperience } = req.body;

    const candidates = await Candidate.find();

    // MATCHING LOGIC
    const rankedCandidates = candidates.map((candidate) => {

      const matchedSkills = candidate.skills.filter((skill) =>
        requiredSkills.includes(skill)
      );

      const skillScore =
        matchedSkills.length / requiredSkills.length;

      const experienceScore =
        candidate.experience >= minExperience ? 1 : 0;

      const totalScore =
        (skillScore * 0.8) + (experienceScore * 0.2);

      return {
        name: candidate.name,
        email: candidate.email,
        skills: candidate.skills,
        experience: candidate.experience,
        bio: candidate.bio,
        matchedSkills,
        score: (totalScore * 100).toFixed(2),
      };
    });

    // SORT BY SCORE
    rankedCandidates.sort(
      (a, b) => b.score - a.score
    );

    // AI DATA
    const candidateData = rankedCandidates.map((c, index) => `
      ${index + 1}.
      Name: ${c.name}
      Skills: ${c.skills.join(", ")}
      Matched Skills: ${c.matchedSkills.join(", ")}
      Experience: ${c.experience} years
      Match Score: ${c.score}%
      Bio: ${c.bio}
    `).join("\n");

    const prompt = `
      Job Requirements:
      Skills: ${requiredSkills.join(", ")}
      Minimum Experience: ${minExperience} years

      Candidates:
      ${candidateData}

      Analyze the candidates and rank them properly based on:
      - skill match
      - experience
      - relevance
      - overall suitability

      Give the best candidates first with explanation.
    `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "AI Shortlisting Failed",
    });
  }
});

module.exports = router;