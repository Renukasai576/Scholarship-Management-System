import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import API from "../services/api";
import "./Results.css";

function Results() {
  const { getToken } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = await getToken();
        const res = await API.get("/applications/merit", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("MERIT DATA:", res.data);
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("Error:", err);
        setData([]);
      }
    };

    fetchResults();
  }, [getToken]);

  return (
    <div className="results-page">
      <h1 className="results-title">Merit List 🏆</h1>

      {data.length === 0 ? (
        <p className="results-empty">No selected students yet</p>
      ) : (
        data.map((item, index) => (
          <div key={item._id} className="results-card">
            <h2 className="results-rank">#{index + 1}</h2>
            <p><strong>🎓 Student:</strong> {item.studentName}</p>
            <p><strong>📚 Scholarship:</strong> {item.scholarshipName}</p>
            <p><strong>🏆 Status:</strong> {item.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Results;

