import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/scholarships")
      .then((res) => setScholarships(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      
      {/* If user is NOT signed in */}
      <SignedOut>
        <SignIn />
      </SignedOut>

      {/* If user IS signed in */}
      <SignedIn>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Scholarships</h1>
          <UserButton />
        </div>

        {scholarships.map((sch) => (
          <div
            key={sch._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h2>{sch.name}</h2>
            <p><b>Provider:</b> {sch.provider}</p>
            <p><b>State:</b> {sch.state}</p>
            <p><b>Income Limit:</b> ₹{sch.incomeLimit}</p>
            <p><b>Minimum Marks:</b> {sch.minMarks}%</p>
            <p><b>Deadline:</b> {new Date(sch.deadline).toDateString()}</p>
            <a href={sch.link} target="_blank" rel="noreferrer">
              Apply Here
            </a>
          </div>
        ))}
      </SignedIn>

    </div>
  );
}

export default App;