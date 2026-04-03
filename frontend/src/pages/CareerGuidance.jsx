import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './CareerGuidance.css';

function CareerGuidance() {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    interests: '',
    skills: '',
    goal: ''
  });

  const [courses, setCourses] = useState([]);
  const [careerPath, setCareerPath] = useState([]);
  const [levelFilter, setLevelFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [savedCourses, setSavedCourses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCourses([]);
    setCareerPath([]);

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5001/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
        setCareerPath(data.career_path || []);
        setSubmitted(true);
      } else {
        setError(`Failed to get recommendations: ${response.status}`);
      }

      // Reset filters/progress if user submits new form
      setLevelFilter('All');
      setPlatformFilter('All');
      setSavedCourses([]);
      setProgress({});
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const levelPriority = (level) => {
    if (level === 'Beginner') return '🟢 Easy';
    if (level === 'Intermediate') return '🟡 Medium';
    if (level === 'Advanced') return '🔴 Hard';
    return '⚪ Unknown';
  };

  const formatMatchColor = (score) => {
    if (score >= 80) return 'rgba(72, 187, 120, 0.15)';
    if (score >= 50) return 'rgba(251, 191, 36, 0.15)';
    return 'rgba(229, 62, 62, 0.15)';
  };

  const filteredCourses = courses.filter((course) => {
    if (levelFilter !== 'All' && course.level !== levelFilter) return false;
    if (platformFilter !== 'All' && course.platform !== platformFilter) return false;
    return true;
  });

  const matchesText = submitted ? `🎉 ${filteredCourses.length} courses matched your profile` : '💡 Enter your profile to find course matches';

  const toggleSave = (course) => {
    setSavedCourses((prev) => {
      const exists = prev.find((item) => item.title === course.title && item.platform === course.platform);
      if (exists) return prev.filter((item) => !(item.title === course.title && item.platform === course.platform));
      return [...prev, course];
    });
  };

  const toggleProgress = (index) => {
    setProgress((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="career-guidance">
      {/* Header */}
      <div className="guidance-header">
        <h1>{matchesText}</h1>
        <p>Based on your skills, these are best for you</p>
      </div>

      <div className="guidance-container">
        {/* Form Section */}
        <div className="form-section">
          <div className="form-card">
            <h2>Find Your Perfect Learning Path</h2>
            <p className="form-subtitle">Tell us your interests, skills, and career goal</p>

            <div className="filter-bar">
              <div className="filter-group">
                <label htmlFor="levelFilter">Level</label>
                <select id="levelFilter" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="platformFilter">Platform</label>
                <select id="platformFilter" value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                  <option value="All">All</option>
                  <option value="Coursera">Coursera</option>
                  <option value="Udemy">Udemy</option>
                  <option value="NPTEL">NPTEL</option>
                  <option value="edX">edX</option>
                  <option value="Internshala">Internshala</option>
                </select>
              </div>

              <div className="filter-group">
                <label>&nbsp;</label>
                <button type="button" className="filter-btn" onClick={() => { setLevelFilter('All'); setPlatformFilter('All'); }}>
                  Reset Filters
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="guidance-form">
              {/* Interests */}
              <div className="form-group">
                <label htmlFor="interests">💡 Your Interests</label>
                <input
                  id="interests"
                  type="text"
                  name="interests"
                  placeholder="e.g., AI coding, data science, web development"
                  value={formData.interests}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Skills */}
              <div className="form-group">
                <label htmlFor="skills">🛠️ Your Current Skills</label>
                <input
                  id="skills"
                  type="text"
                  name="skills"
                  placeholder="e.g., python, javascript, statistics"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Goal */}
              <div className="form-group">
                <label htmlFor="goal">🎯 Your Career Goal</label>
                <input
                  id="goal"
                  type="text"
                  name="goal"
                  placeholder="e.g., become a data scientist, web developer"
                  value={formData.goal}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Finding matches...' : '🚀 Get Recommendations'}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        {submitted && (
          <div className="results-section">
            {/* Recommended Courses */}
            <div className="courses-section">
              <div className="section-header">
                <h2>📚 Recommended Courses</h2>
                <p>{filteredCourses.length} courses matched your profile</p>
              </div>

              {courses.length === 0 ? (
                <div className="no-results">
                  <p>No courses found. Try adjusting your preferences.</p>
                </div>
              ) : (
                <div className="courses-grid">
                  {filteredCourses.map((course, index) => {
                    const isBest = index === 0;
                    const isSaved = savedCourses.some((item) => item.title === course.title && item.platform === course.platform);
                    const finished = !!progress[index];
                    return (
                      <div key={index} className={`course-card ${isBest ? 'best-match' : ''}`} style={{ borderColor: isBest ? '#f6ad55' : undefined }}>
                        <div className="course-header">
                          <span className="course-rank">{isBest ? '🏆 BEST MATCH' : `#${index + 1}`}</span>
                          <span className="course-level">{levelPriority(course.level)}</span>
                        </div>

                        <h3>{course.title}</h3>
                        <p className="course-platform">{course.platform}</p>

                        <div className="match-chip" style={{ background: formatMatchColor(course.matchScore) }}>
                          🔥 Match: {course.matchScore ?? 0}%
                        </div>

                        <div className="course-meta">
                          <div className="meta-item">
                            <span className="meta-label">Domain:</span>
                            <span className="meta-value">{course.domain}</span>
                          </div>
                          <div className="meta-item">
                            <span className="meta-label">Skills:</span>
                            <span className="meta-value">{course.skills}</span>
                          </div>
                        </div>

                        <div className="why-recommended">
                          <h4>🧠 Why Recommended:</h4>
                          <ul>
                            {(course.matchReasons || []).slice(0, 3).map((reason, idx) => (
                              <li key={idx}>✔ {reason}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="progress-row">
                          <button type="button" className="progress-btn" onClick={() => toggleProgress(index)}>
                            {finished ? '✔ Completed' : '⬜ Mark as Completed'}
                          </button>
                          <button type="button" className="save-btn" onClick={() => toggleSave(course)}>
                            {isSaved ? '★ Saved' : '⭐ Save'}
                          </button>
                        </div>

                        <div className="course-actions-row">
                          <a href={course.link} target="_blank" rel="noopener noreferrer" className="course-link-btn">
                            Open Course Link →
                          </a>
                          <Link to="/scholarships" className="course-link-btn course-link-secondary">
                            Explore Scholarships →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Career Path Roadmap */}
            {careerPath.length > 0 && (
              <div className="career-path-section">
                <div className="section-header">
                  <h2>🧭 Your Career Path Roadmap</h2>
                  <p>Follow these steps to reach your goal</p>
                </div>

                <div className="career-path">
                  {careerPath.map((step, index) => (
                    <div key={index} className="path-step">
                      <div className="step-icon">✓</div>
                      <div className="step-content">
                        <h4>Step {index + 1}</h4>
                        <p>{step}</p>
                      </div>
                      {index < careerPath.length - 1 && <div className="step-connector">↓</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerGuidance;