import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  // FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    bio: "",
  });

  // ALL CANDIDATES
  const [candidates, setCandidates] = useState([]);

  // MATCH DATA
  const [matchData, setMatchData] = useState({
    requiredSkills: "",
    minExperience: "",
  });

  // MATCHED CANDIDATES
  const [matchedCandidates, setMatchedCandidates] = useState([]);

  // AI RESPONSE
  const [aiResponse, setAiResponse] = useState("");



  // FETCH CANDIDATES
  const fetchCandidates = async () => {
    try {

      const response = await axios.get(
        "https://ese-project-rwau.onrender.com"
      );

      setCandidates(response.data);

    } catch (error) {
      console.log(error);
    }
  };



  // LOAD DATA
  useEffect(() => {
    let ignore = false;

    const loadCandidates = async () => {
      try {
        const response = await axios.get(
          "https://ese-project-rwau.onrender.com"
        );

        if (!ignore) {
          setCandidates(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadCandidates();

    return () => {
      ignore = true;
    };
  }, []);




  // HANDLE ADD FORM
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  // HANDLE MATCH FORM
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

      await axios.post(
        "https://ese-project-rwau.onrender.com",
        candidateData
      );

      alert("Candidate Added Successfully");

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
  const matchCandidates = async () => {

    try {

      const response = await axios.post(
        "https://ese-project-rwau.onrender.com",
        {
          requiredSkills: matchData.requiredSkills.split(","),
          minExperience: Number(matchData.minExperience),
        }
      );

      setMatchedCandidates(response.data);

    } catch (error) {

      console.log(error);
    }
  };



  // AI SHORTLIST
  const getAIShortlist = async () => {

  try {

    const response = await axios.post(
      "https://ese-project-rwau.onrender.com",
      {
        requiredSkills: matchData.requiredSkills.split(","),
        minExperience: Number(matchData.minExperience),
      }
    );

    const aiText =
      response.data.choices[0].message.content;

    setAiResponse(aiText);

  } catch (error) {

    console.log(error);

    alert("AI Recommendation Failed");
  }
};


// DELETE CANDIDATE
const deleteCandidate = async (id) => {

  try {

    await axios.delete(
      `https://ese-project-rwau.onrender.com/${id}`
    );

    alert("Candidate Deleted");

    fetchCandidates();

  } catch (error) {

    console.log(error);

    alert("Delete Failed");
  }
};



  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">CS</span>
            <div>
              <h1>Candidate Shortlisting System</h1>
              <p>Manage candidates, match skills, and review AI-assisted recommendations.</p>
            </div>
          </div>

          <span className="topbar-pill">Recruitment Dashboard</span>
        </div>
      </header>

      <main className="dashboard">
        <section className="stats-strip" aria-label="Candidate summary">
          <div className="stat-card">
            <span>Total Candidates</span>
            <strong>{candidates.length}</strong>
          </div>
          <div className="stat-card">
            <span>Current Matches</span>
            <strong>{matchedCandidates.length}</strong>
          </div>
          <div className="stat-card">
            <span>Minimum Experience</span>
            <strong>{matchData.minExperience || 0}y</strong>
          </div>
        </section>

        <section className="grid-layout">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <h2>Add Candidate</h2>
                <p>Create a clean candidate profile for the shortlist pool.</p>
              </div>
            </div>

            <form className="panel-body" onSubmit={addCandidate}>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Aarav Sharma"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="aarav@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="skills">Skills</label>
                  <input
                    id="skills"
                    type="text"
                    name="skills"
                    placeholder="React, Node.js, MongoDB"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="experience">Experience</label>
                  <input
                    id="experience"
                    type="number"
                    name="experience"
                    placeholder="3"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field full">
                  <label htmlFor="bio">Candidate Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Briefly summarize the candidate's background, projects, and strengths."
                    rows="5"
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <button className="btn btn-primary" type="submit">
                Add Candidate
              </button>
            </form>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <h2>Match Candidates</h2>
                <p>Filter profiles against required skills and experience.</p>
              </div>

              <div className="actions">
                <button onClick={matchCandidates} className="btn btn-secondary" type="button">
                  Match
                </button>
                <button onClick={getAIShortlist} className="btn btn-accent" type="button">
                  AI Shortlist
                </button>
              </div>
            </div>

            <div className="panel-body">
              <div className="match-controls">
                <div className="form-field">
                  <label htmlFor="requiredSkills">Required Skills</label>
                  <input
                    id="requiredSkills"
                    type="text"
                    name="requiredSkills"
                    placeholder="React, Express, SQL"
                    value={matchData.requiredSkills}
                    onChange={handleMatchChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="minExperience">Minimum Experience</label>
                  <input
                    id="minExperience"
                    type="number"
                    name="minExperience"
                    placeholder="2"
                    value={matchData.minExperience}
                    onChange={handleMatchChange}
                  />
                </div>
              </div>

              <div className="scroll-area">
                {matchedCandidates.length === 0 ? (
                  <p className="empty-state">Matched candidates will appear here.</p>
                ) : (
                  <div className="result-list">
                    {matchedCandidates.map((candidate, index) => (
                      <article key={index} className="result-card">
                        <div className="result-head">
                          <div>
                            <h3 className="candidate-name">{candidate.name}</h3>
                            <p className="candidate-email">{candidate.email}</p>
                          </div>
                          <span className="score">{candidate.matchScore}</span>
                        </div>

                        <div className="tag-row">
                          {(candidate.matchedSkills || []).map((skill, idx) => (
                            <span key={idx} className="tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid-layout">
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <h2>All Candidates</h2>
                <p>Review every profile currently available for shortlisting.</p>
              </div>
            </div>

            <div className="panel-body">
              <div className="scroll-area tall">
                {candidates.length === 0 ? (
                  <p className="empty-state">No candidates found yet.</p>
                ) : (
                  <div className="card-grid">
                    {candidates.map((candidate) => (
                      <article key={candidate._id} className="candidate-card">
                        <div className="card-head">
                          <div>
                            <h3 className="candidate-name">{candidate.name}</h3>
                            <p className="candidate-email">{candidate.email}</p>
                          </div>

                          <div className="meta-actions">
                            <span className="tag experience">{candidate.experience} yrs</span>
                            <button
                              onClick={() => deleteCandidate(candidate._id)}
                              className="btn btn-danger"
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <p className="candidate-bio">{candidate.bio}</p>

                        <div className="tag-row">
                          {(candidate.skills || []).map((skill, index) => (
                            <span key={index} className="tag skill">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">
                <h2>AI Recommendation</h2>
                <p>Generated shortlist notes based on the current match criteria.</p>
              </div>
            </div>

            <div className="panel-body">
              <div className="ai-panel">
                <pre className="ai-copy">
                  {aiResponse || "AI recommendation will appear here after you run AI Shortlist."}
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
