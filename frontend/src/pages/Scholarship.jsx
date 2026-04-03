import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api";
import ScholarshipCard from "../components/ScholarshipCard";
import Profile from "./Profile";
import "./Scholarship.css";

function Scholarships() {
  const { getToken } = useAuth();

  const [profileComplete, setProfileComplete] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [statusMap, setStatusMap] = useState({}); // 🔥 track status

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const token = await getToken();

        const res = await API.post(
          "/scholarships/filter",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.data.profileComplete) {
          setProfileComplete(true);
          setScholarships(res.data.eligibleScholarships);
        } else {
          setProfileComplete(false);
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchScholarships();
  }, []);

  // 🔥 APPLY
  const handleApply = async (id) => {
    try {
      const token = await getToken();
      await API.post("/applications/apply", {
        scholarshipId: id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatusMap((prev) => ({
        ...prev,
        [id]: "applied"
      }));

    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 SELECTED
  const handleSelected = async (id) => {
    try {
      const token = await getToken();
      await API.post("/applications/apply", {
        scholarshipId: id,
        status: "selected"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatusMap((prev) => ({
        ...prev,
        [id]: "selected"
      }));

    } catch (err) {
      console.log(err);
    }
  };

  if (profileComplete === null) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="scholarships-container">

      {profileComplete ? (
        <>
          <h2 className="scholarships-title">Eligible Scholarships 🎓</h2>

          {scholarships.length > 0 ? (
            <div className="scholarships-grid">

              {scholarships.map((sch) => {
                const status = statusMap[sch._id];

                return (
                  <div key={sch._id} className="sch-wrapper">

                    <ScholarshipCard data={sch} />

                    {/* 🔥 STATUS UI */}
                    {status === "selected" ? (
                      <p className="selected-text">🏆 Selected</p>
                    ) : status === "applied" ? (
                      <p className="applied-text">✅ Applied</p>
                    ) : null}

                    {/* 🔥 ACTION BUTTONS */}
                    <div className="sch-actions">

                      <button
                        disabled={status === "applied" || status === "selected"}
                        onClick={() => handleApply(sch._id)}
                      >
                        Apply
                      </button>

                      <button
                        disabled={status === "selected"}
                        onClick={() => handleSelected(sch._id)}
                      >
                        Got Scholarship
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>
          ) : (
            <p className="no-data">
              No scholarships available for your profile.
            </p>
          )}
        </>
      ) : (
        <Profile />
      )}

    </div>
  );
}

export default Scholarships;