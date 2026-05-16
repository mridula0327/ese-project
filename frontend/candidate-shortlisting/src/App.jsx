import { useEffect, useState } from "react";
import axios from "axios";

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
    fetchCandidates();
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

    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-5 shadow-lg">

        <h1 className="text-4xl font-bold tracking-wide">
          Candidate Shortlisting System
        </h1>

      </nav>



      {/* TOP SECTION */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ADD CANDIDATE */}
        <div className="bg-white rounded-3xl shadow-md p-6">

          <h2 className="text-3xl font-bold text-blue-700 mb-6">
            Add Candidate
          </h2>

          <form className="space-y-4" onSubmit={addCandidate}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 p-4 rounded-xl outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 p-4 rounded-xl outline-none"
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                name="skills"
                placeholder="Skills (React, Node.js)"
                value={formData.skills}
                onChange={handleChange}
                className="border border-gray-300 p-4 rounded-xl outline-none"
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience"
                value={formData.experience}
                onChange={handleChange}
                className="border border-gray-300 p-4 rounded-xl outline-none"
              />

            </div>

            <textarea
              name="bio"
              placeholder="Candidate Bio"
              rows="5"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border border-gray-300 p-4 rounded-xl outline-none"
            ></textarea>

            <button
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white w-full py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition"
            >
              Add Candidate
            </button>

          </form>

        </div>



        {/* MATCH SECTION */}
        <div className="bg-white rounded-3xl shadow-md p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

            <h2 className="text-3xl font-bold text-purple-700">
              Matched Candidates
            </h2>

            <div className="flex gap-3">

              <button
                onClick={matchCandidates}
                className="border-2 border-purple-600 text-purple-700 px-5 py-3 rounded-xl font-semibold hover:bg-purple-50"
              >
                Match Candidates
              </button>

              <button
                onClick={getAIShortlist}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl font-semibold"
              >
                AI Shortlist
              </button>

            </div>
          </div>



          <div className="space-y-4">

            <input
              type="text"
              name="requiredSkills"
              placeholder="Required Skills"
              value={matchData.requiredSkills}
              onChange={handleMatchChange}
              className="w-full border border-gray-300 p-4 rounded-xl outline-none"
            />

            <input
              type="number"
              name="minExperience"
              placeholder="Minimum Experience"
              value={matchData.minExperience}
              onChange={handleMatchChange}
              className="w-full border border-gray-300 p-4 rounded-xl outline-none"
            />

          </div>



          {/* MATCH RESULTS */}
          <div className="mt-6 space-y-4 max-h-[350px] overflow-y-auto">

            {matchedCandidates.map((candidate, index) => (

              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-5 border border-gray-200"
              >

                <div className="flex justify-between items-center mb-3">

                  <div>

                    <h3 className="text-xl font-bold">
                      {candidate.name}
                    </h3>

                    <p className="text-gray-500">
                      {candidate.email}
                    </p>

                  </div>

                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                    {candidate.matchScore}
                  </span>

                </div>

                <div className="flex flex-wrap gap-2">

                  {candidate.matchedSkills.map((skill, idx) => (

                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
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



      {/* BOTTOM SECTION */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ALL CANDIDATES */}
        <div className="bg-white rounded-3xl shadow-md p-6">

          <h2 className="text-3xl font-bold text-blue-700 mb-6">
            All Candidates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {candidates.map((candidate) => (

              <div
                key={candidate._id}
                className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition"
              >

                <div className="flex justify-between items-start mb-3">

  <div>

    <h3 className="text-xl font-bold">
      {candidate.name}
    </h3>

  </div>

  <div className="flex gap-2">

    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
      {candidate.experience} yrs
    </span>

    <button
      onClick={() => deleteCandidate(candidate._id)}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
    >
      Delete
    </button>

  </div>

</div>

                <p className="text-gray-500 mb-3">
                  {candidate.email}
                </p>

                <p className="text-gray-700 mb-4">
                  {candidate.bio}
                </p>

                <div className="flex flex-wrap gap-2">

                  {candidate.skills.map((skill, index) => (

                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>

            ))}

          </div>

        </div>



        {/* AI RECOMMENDATION */}
        <div className="bg-white rounded-3xl shadow-md p-6">

          <h2 className="text-3xl font-bold text-purple-700 mb-6">
            AI Recommendation
          </h2>

          <div className="border border-purple-200 rounded-2xl p-5 h-[500px] overflow-y-auto">

            <pre className="whitespace-pre-wrap text-gray-700 leading-8 font-sans">
              {aiResponse || "AI recommendation will appear here..."}
            </pre>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;