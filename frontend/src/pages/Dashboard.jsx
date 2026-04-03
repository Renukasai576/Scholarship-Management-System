import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api";
import ScholarshipCard from "../components/ScholarshipCard";
import Profile from "./Profile";

function Dashboard() {

  const { getToken, isLoaded, isSignedIn } = useAuth(); // ✅ UPDATED

  const [profileComplete, setProfileComplete] = useState(null);
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {

    // ⛔ WAIT until Clerk is ready
    if (!isLoaded || !isSignedIn) return;

    const fetchScholarships = async () => {
      try {
        const token = await getToken();

        console.log("TOKEN:", token); // debug

        const res = await API.post(
          "/scholarships/filter",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Dashboard Response:", res.data);

        if (res.data.profileComplete) {
          setProfileComplete(true);
          setScholarships(res.data.eligibleScholarships);
        } else {
          setProfileComplete(false);
        }

      } catch (err) {
        console.log("Dashboard Error:", err);
        setProfileComplete(false); // fallback
      }
    };

    fetchScholarships();

  }, [isLoaded, isSignedIn]);

  // ⏳ WAIT UI
  if (!isLoaded || profileComplete === null) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>

      {profileComplete ? (
        scholarships.length > 0 ? (
          scholarships.map((sch) => (
            <ScholarshipCard key={sch._id} data={sch} />
          ))
        ) : (
          <h3>No scholarships available</h3>
        )
      ) : (
        <Profile />
      )}

    </div>
  );
}

export default Dashboard;