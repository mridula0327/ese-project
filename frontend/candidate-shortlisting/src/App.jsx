import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  // API BASE URL
  const API = "https://ese-project-rwau.onrender.com/api/candidates";

  // FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    bio: "",
  });

  // CANDIDATES
  const [candidates, setCandidates] = useState([]);

  // MATCH DATA
  const [matchData, setMatchData] = useState({
    requiredSkills: "",
    minExperience: "",
  });

  // MATCHED
  const [matchedCandidates, setMatchedCandidates] = useState([]);

  // AI RESPONSE
  const [aiResponse, setAiResponse] = useState("");



  // FETCH CANDIDATES
  const fetchCandidates = async () => {

    try {

      const response = await axios.get(API);

      setCandidates(response.data);

    } catch (error) {

      console.log(error);
    }
  };



  // LOAD
  useEffect(() => {

    fetchCandidates();

  }, []);




  // HANDLE FORM
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  // HANDLE MATCH
  const handleMatchChange = (e) => {

    setMatchData({
      ...matchData,
      [e.target.name]: e.target.value,
    });
  };



  // ADD CANDIDATE
  const addCandidate = async (e) => {

    e.preventDefault();

    try {

      const candidateData = {
        ...formData,
        skills: formData.skills.split(","),
      };

      await axios.post(API, candidateData);

      alert("Candidate Added");

      setFormData({
        name: "",
        email: "",
        skills: "",
        experience: "",
        bio: "",
      });

      fetchCandidates();

    } catch (error) {

      console.log(error);

      alert("Error Adding Candidate");
    }
  };



  // MATCH CANDIDATES
  const matchCandidates = () => {

    const filtered = candidates.filter((candidate) => {

      const skillMatch =
        matchData.requiredSkills === ""
          ? true
          : matchData.requiredSkills
              .toLowerCase()
              .split(",")
              .some((skill) =>
                candidate.skills.join(" ").toLowerCase().includes(skill.trim())
              );

      const experienceMatch =
        Number(candidate.experience) >=
        Number(matchData.minExperience || 0);

      return skillMatch && experienceMatch;
    });

    setMatchedCandidates(filtered);
  };



  // AI SHORTLIST
  const getAIShortlist = () => {

    if (matchedCandidates.length === 0) {

      setAiResponse(
        "No matched candidates found. Please run candidate matching first."
      );

      return;
    }

    const text = matchedCandidates
      .map(
        (candidate, index) =>
          `${index + 1}. ${candidate.name}
Skills: ${candidate.skills.join(", ")}
Experience: ${candidate.experience} years
Bio: ${candidate.bio}
`
      )
      .join("\n");

    setAiResponse(text);
  };



  // DELETE
  const deleteCandidate = async (id) => {

    try {

      await axios.delete(`${API}/${id}`);

      alert("Candidate Deleted");

      fetchCandidates();

    } catch (error) {

      console.log(error);

      alert("Delete Failed");
    }
  };



  return (
    <div className="app-shell">

      {/* TOPBAR */}
      <header className="topbar">

        <div className="topbar-inner">

          <div className="brand">

            <span className="brand-mark">
              CS
            </span>

            <div>

              <h1>Candidate Shortlisting System</h1>

              <p>
                Manage candidates, match skills, and review AI recommendations.
              </p>

            </div>

          </div>

          <span className="topbar-pill">
            Recruitment Dashboard
          </span>

        </div>

      </header>



      {/* MAIN */}
      <main className="dashboard">

        {/* STATS */}
        <section className="stats-strip">

          <div className="stat-card">
            <span>Total Candidates</span>
            <strong>{candidates.length}</strong>
          </div>

          <div className="stat-card">
            <span>Matched Candidates</span>
            <strong>{matchedCandidates.length}</strong>
          </div>

          <div className="stat-card">
            <span>Minimum Experience</span>
            <strong>{matchData.minExperience || 0}y</strong>
          </div>

        </section>



        {/* TOP GRID */}
        <section className="grid-layout">

          {/* ADD PANEL */}
          <div className="panel">

            <div className="panel-header">

              <div className="panel-title">

                <h2>Add Candidate</h2>

                <p>
                  Add professional candidate profiles.
                </p>

              </div>

            </div>



            <form className="panel-body" onSubmit={addCandidate}>

              <div className="form-grid">

                <div className="form-field">

                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                  />

                </div>



                <div className="form-field">

                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@gmail.com"
                  />

                </div>



                <div className="form-field">

                  <label>Skills</label>

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js"
                  />

                </div>



                <div className="form-field">

                  <label>Experience</label>

                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="2"
                  />

                </div>



                <div className="form-field full">

                  <label>Bio</label>

                  <textarea
                    name="bio"
                    rows="5"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Candidate background..."
                  ></textarea>

                </div>

              </div>



              <button type="submit" className="btn btn-primary">
                Add Candidate
              </button>

            </form>

          </div>



          {/* MATCH PANEL */}
          <div className="panel">

            <div className="panel-header">

              <div className="panel-title">

                <h2>Match Candidates</h2>

                <p>
                  Match profiles according to required skills.
                </p>

              </div>



              <div className="actions">

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={matchCandidates}
                >
                  Match
                </button>

                <button
                  className="btn btn-accent"
                  type="button"
                  onClick={getAIShortlist}
                >
                  AI Shortlist
                </button>

              </div>

            </div>



            <div className="panel-body">

              <div className="match-controls">

                <div className="form-field">

                  <label>Required Skills</label>

                  <input
                    type="text"
                    name="requiredSkills"
                    value={matchData.requiredSkills}
                    onChange={handleMatchChange}
                    placeholder="React, MongoDB"
                  />

                </div>



                <div className="form-field">

                  <label>Minimum Experience</label>

                  <input
                    type="number"
                    name="minExperience"
                    value={matchData.minExperience}
                    onChange={handleMatchChange}
                    placeholder="2"
                  />

                </div>

              </div>



              <div className="scroll-area">

                {matchedCandidates.length === 0 ? (

                  <p className="empty-state">
                    No matched candidates.
                  </p>

                ) : (

                  <div className="card-grid">

                    {matchedCandidates.map((candidate) => (

                      <div
                        key={candidate._id}
                        className="result-card"
                      >

                        <div className="result-head">

                          <div>

                            <h3 className="candidate-name">
                              {candidate.name}
                            </h3>

                            <p className="candidate-email">
                              {candidate.email}
                            </p>

                          </div>

                        </div>



                        <div className="tag-row">

                          {candidate.skills.map((skill, index) => (

                            <span
                              key={index}
                              className="tag skill"
                            >
                              {skill}
                            </span>

                          ))}

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>

        </section>



        {/* BOTTOM */}
        <section className="grid-layout">

          {/* ALL CANDIDATES */}
          <div className="panel">

            <div className="panel-header">

              <div className="panel-title">

                <h2>All Candidates</h2>

                <p>
                  Complete candidate list.
                </p>

              </div>

            </div>



            <div className="panel-body">

              <div className="scroll-area tall">

                <div className="card-grid">

                  {candidates.map((candidate) => (

                    <div
                      key={candidate._id}
                      className="candidate-card"
                    >

                      <div className="card-head">

                        <div>

                          <h3 className="candidate-name">
                            {candidate.name}
                          </h3>

                          <p className="candidate-email">
                            {candidate.email}
                          </p>

                        </div>



                        <div className="meta-actions">

                          <span className="tag experience">
                            {candidate.experience} yrs
                          </span>

                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() =>
                              deleteCandidate(candidate._id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>



                      <p className="candidate-bio">
                        {candidate.bio}
                      </p>



                      <div className="tag-row">

                        {candidate.skills.map((skill, index) => (

                          <span
                            key={index}
                            className="tag skill"
                          >
                            {skill}
                          </span>

                        ))}

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>



          {/* AI */}
          <div className="panel">

            <div className="panel-header">

              <div className="panel-title">

                <h2>AI Recommendation</h2>

                <p>
                  AI generated shortlist.
                </p>

              </div>

            </div>



            <div className="panel-body">

              <div className="ai-panel">

                <pre className="ai-copy">

                  {aiResponse ||
                    "AI recommendation will appear here."}

                </pre>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;