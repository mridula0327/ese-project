import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {

  // API
  const API = "http://localhost:5000/api/candidates";

  // FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    skills: "",
    performanceScore: "",
    experience: "",
  });

  // EMPLOYEES
  const [employees, setEmployees] = useState([]);

  // FILTER DATA
  const [matchData, setMatchData] = useState({
    requiredSkills: "",
    minExperience: "",
  });

  // FILTERED EMPLOYEES
  const [matchedEmployees, setMatchedEmployees] = useState([]);

  // AI RESPONSE
  const [aiResponse, setAiResponse] = useState("");



  // FETCH EMPLOYEES
  const fetchEmployees = async () => {

    try {

      const response = await axios.get(API);

      setEmployees(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.log(error);
    }
  };



  // LOAD DATA
  useEffect(() => {

    fetchEmployees();

  }, []);



  // HANDLE FORM
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  // HANDLE FILTER
  const handleMatchChange = (e) => {

    setMatchData({
      ...matchData,
      [e.target.name]: e.target.value,
    });
  };



  // ADD EMPLOYEE
  const addEmployee = async (e) => {

    e.preventDefault();

    try {

      const employeeData = {
        ...formData,

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim()),

        performanceScore: Number(formData.performanceScore),

        experience: Number(formData.experience),
      };

      await axios.post(API, employeeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Employee Added Successfully");

      setFormData({
        name: "",
        email: "",
        department: "",
        skills: "",
        performanceScore: "",
        experience: "",
      });

      fetchEmployees();

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data?.message ||
        error.message ||
        "Error Adding Employee"
      );
    }
  };



  // FILTER EMPLOYEES
  const filterEmployees = () => {

    const filtered = employees.filter((employee) => {

      const employeeSkills = employee.skills || [];

      const skillMatch =
        matchData.requiredSkills === ""
          ? true
          : matchData.requiredSkills
              .toLowerCase()
              .split(",")
              .some((skill) =>
                employeeSkills
                  .join(" ")
                  .toLowerCase()
                  .includes(skill.trim())
              );

      const experienceMatch =
        Number(employee.experience || 0) >=
        Number(matchData.minExperience || 0);

      return skillMatch && experienceMatch;
    });

    setMatchedEmployees(filtered);
  };



  // AI RECOMMENDATION
  const getAIRecommendation = () => {

    if (matchedEmployees.length === 0) {

      setAiResponse(
        "No employees matched. Please run analytics first."
      );

      return;
    }

    const rankedEmployees = [...matchedEmployees].sort(
      (a, b) =>
        Number(b.performanceScore || 0) -
        Number(a.performanceScore || 0)
    );

    const text = rankedEmployees
      .map(
        (employee, index) => `
Rank ${index + 1}

Employee: ${employee.name || "N/A"}

Department: ${employee.department || "N/A"}

Skills:
${(employee.skills || []).join(", ")}

Performance Score:
${employee.performanceScore || 0}

Experience:
${employee.experience || 0} years

AI Recommendation:
${
  Number(employee.performanceScore || 0) >= 85
    ? "Eligible for Promotion"
    : Number(employee.performanceScore || 0) >= 60
    ? "Recommended for Skill Enhancement Training"
    : "Needs Performance Improvement"
}

---------------------------------------
`
      )
      .join("\n");

    setAiResponse(text);
  };



  // DELETE EMPLOYEE
  const deleteEmployee = async (id) => {

    try {

      await axios.delete(`${API}/${id}`);

      alert("Employee Deleted");

      fetchEmployees();

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
              AI
            </span>

            <div>

              <h1>
                AI Employee Performance Analytics System
              </h1>

              <p>
                Analyze employee performance and generate AI recommendations.
              </p>

            </div>

          </div>

          <span className="topbar-pill">
            HR Analytics Dashboard
          </span>

        </div>

      </header>



      {/* MAIN */}
      <main className="dashboard">

        {/* STATS */}
        <section className="stats-strip">

          <div className="stat-card">
            <span>Total Employees</span>
            <strong>{employees.length}</strong>
          </div>

          <div className="stat-card">
            <span>Filtered Employees</span>
            <strong>{matchedEmployees.length}</strong>
          </div>

          <div className="stat-card">
            <span>Minimum Experience</span>
            <strong>{matchData.minExperience || 0}y</strong>
          </div>

        </section>



        {/* TOP GRID */}
        <section className="grid-layout">

          {/* ADD EMPLOYEE */}
          <div className="panel">

            <div className="panel-header">

              <div className="panel-title">

                <h2>Add Employee</h2>

                <p>
                  Register employee performance details.
                </p>

              </div>

            </div>



            <form
              className="panel-body"
              onSubmit={addEmployee}
            >

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

                  <label>Department</label>

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Development"
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

                  <label>Performance Score</label>

                  <input
                    type="number"
                    name="performanceScore"
                    value={formData.performanceScore}
                    onChange={handleChange}
                    placeholder="85"
                  />

                </div>



                <div className="form-field">

                  <label>Experience</label>

                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="3"
                  />

                </div>

              </div>



              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Employee
              </button>

            </form>

          </div>



          {/* ANALYTICS */}
          <div className="panel">

            <div className="panel-header">

              <div className="panel-title">

                <h2>Employee Analytics</h2>

                <p>
                  Filter employees using skills and experience.
                </p>

              </div>



              <div className="actions">

                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={filterEmployees}
                >
                  Analyze
                </button>

                <button
                  className="btn btn-accent"
                  type="button"
                  onClick={getAIRecommendation}
                >
                  AI Recommendation
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

                {matchedEmployees.length === 0 ? (

                  <p className="empty-state">
                    No employees found.
                  </p>

                ) : (

                  <div className="card-grid">

                    {matchedEmployees.map((employee) => (

                      <div
                        key={employee._id}
                        className="result-card"
                      >

                        <div className="result-head">

                          <div>

                            <h3 className="candidate-name">
                              {employee.name || "N/A"}
                            </h3>

                            <p className="candidate-email">
                              {employee.email || "N/A"}
                            </p>

                          </div>

                          <span className="score">
                            {employee.performanceScore || 0}
                          </span>

                        </div>



                        <div className="tag-row">

                          {(employee.skills || []).map(
                            (skill, index) => (

                              <span
                                key={index}
                                className="tag skill"
                              >
                                {skill}
                              </span>

                            )
                          )}

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

          {/* ALL EMPLOYEES */}
          <div className="panel">

            <div className="panel-header">

              <div className="panel-title">

                <h2>All Employees</h2>

                <p>
                  Employee performance records.
                </p>

              </div>

            </div>



            <div className="panel-body">

              <div className="scroll-area tall">

                <div className="card-grid">

                  {employees.map((employee) => (

                    <div
                      key={employee._id}
                      className="candidate-card"
                    >

                      <div className="card-head">

                        <div>

                          <h3 className="candidate-name">
                            {employee.name || "N/A"}
                          </h3>

                          <p className="candidate-email">
                            {employee.email || "N/A"}
                          </p>

                        </div>



                        <div className="meta-actions">

                          <span className="tag experience">
                            {employee.experience || 0} yrs
                          </span>

                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() =>
                              deleteEmployee(employee._id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>



                      <p className="candidate-bio">

                        Department:
                        {" "}
                        {employee.department || "N/A"}

                        <br /><br />

                        Performance Score:
                        {" "}
                        {employee.performanceScore || 0}

                      </p>



                      <div className="tag-row">

                        {(employee.skills || []).map(
                          (skill, index) => (

                            <span
                              key={index}
                              className="tag skill"
                            >
                              {skill}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>



          {/* AI PANEL */}
          <div className="panel">

            <div className="panel-header">

              <div className="panel-title">

                <h2>AI Recommendation</h2>

                <p>
                  AI-generated promotion and training suggestions.
                </p>

              </div>

            </div>



            <div className="panel-body">

              <div className="ai-panel">

                <pre className="ai-copy">

                  {aiResponse ||
                    "AI recommendations will appear here."}

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