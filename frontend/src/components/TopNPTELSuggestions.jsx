import { useEffect, useState } from "react";

function TopNPTELSuggestions() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://scholarship-management-system-runz.onrender.com/api/top-nptel-courses");
        if (!response.ok) {
          throw new Error(`Failed to load courses (${response.status})`);
        }

        const data = await response.json();
        const sorted = (data || [])
          .sort((a, b) => b.recommendedBy - a.recommendedBy)
          .slice(0, 3);
        setCourses(sorted);
      } catch (err) {
        setError(err.message || "Unable to fetch top NPTEL courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <section className="top-nptel-suggestions">
      <div className="top-nptel-header">
        <p className="top-nptel-label">🔥 Most Recommended NPTEL Courses by Seniors</p>
        <p className="top-nptel-copy">Trusted picks from senior students to help you get started fast.</p>
      </div>

      <div className="top-nptel-cards">
        {loading && (
          <div className="top-nptel-empty">Loading top courses...</div>
        )}

        {error && (
          <div className="top-nptel-empty top-nptel-error">{error}</div>
        )}

        {!loading && !error && courses.map((course, index) => (
          <article
            key={course.title}
            className={`top-nptel-card ${index === 0 ? "top-nptel-card-best" : ""}`}
          >
            <div className="top-nptel-rank-row">
              <span className="top-nptel-rank">#{index + 1}</span>
              {index === 0 && <span className="top-nptel-best">🏆 Best Pick</span>}
            </div>

            <h3>{course.title}</h3>
            <p className="top-nptel-info">Recommended by {course.recommendedBy} students</p>
            <a
              href={course.link}
              target="_blank"
              rel="noreferrer"
              className="top-nptel-action"
            >
              Explore Course →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TopNPTELSuggestions;
