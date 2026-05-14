import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Home.css";

import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import heroPhoto from "../assets/hero-student.jpeg";
import tcs from "../assets/tcs.png";
import google from "../assets/google.png";
import amazon from "../assets/amazon.png";
import samsung from "../assets/Samsung.png";
import apple from "../assets/apple.png";
import infosys from "../assets/infosys-logo.png";
import reliance from "../assets/relaince.png";
import sbi from "../assets/sbi.png";

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, scholarships: 0 });

  useEffect(() => {
    API.get("/stats")
      .then((res) => {
        setStats({
          users: res.data.totalStudents || res.data.users || 0,
          scholarships: res.data.totalScholarships || res.data.scholarships || 0
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="hero-label">Scholarships made simple</span>
          <h1>Find the right opportunity faster and grow your future.</h1>
          <p>
            Scholoholic collects verified scholarships, guided applications, and trusted partners so you can focus on what matters.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/scholarships")}>Explore Scholarships</button>
            <button className="btn-secondary" onClick={() => navigate("/profile")}>Complete Profile</button>
          </div>

          <div className="hero-metrics">
            <div className="hero-metric">
              <strong>{stats.scholarships}+</strong>
              <span>Scholarship options</span>
            </div>
            <div className="hero-metric">
              <strong>{stats.users}+</strong>
              <span>Students supported</span>
            </div>
            <div className="hero-metric">
              <strong>4.8/5</strong>
              <span>Average satisfaction</span>
            </div>
          </div>
        </div>

        <div className="hero-image-card">
          <div className="hero-image-frame">
            <div className="hero-image-topline">Driving student success with smarter funding</div>
            <div className="hero-image-main">
              <img src={heroPhoto} alt="Student" />
            </div>
          </div>
          <div className="hero-image-caption">
            <strong>Professional scholarship guidance</strong>
            <span>Supported by top institutions and mentors.</span>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <h3>Scholarships</h3>
          <p>{stats.scholarships}+</p>
        </div>
        <div className="stat-card">
          <h3>Students</h3>
          <p>{stats.users}+</p>
        </div>
        <div className="stat-card">
          <h3>Trusted Partners</h3>
          <p>200+</p>
        </div>
      </section>

      <section className="steps-section">
        <h2>
          Steps to Follow for Getting <span>a Scholarship</span>
        </h2>
        <div className="steps-container">
          <div className="step-card" onClick={() => navigate("/profile")}> 
            <img src={img1} alt="register" />
            <h3>Create your profile</h3>
            <p>Complete your details so we can match scholarships to your goals.</p>
          </div>
          <div className="step-card" onClick={() => navigate("/scholarships")}> 
            <img src={img2} alt="search" />
            <h3>Find tailored scholarships</h3>
            <p>Browse curated listings and choose the best fit for your field.</p>
          </div>
          <div className="step-card highlight" onClick={() => navigate("/scholarships")}> 
            <img src={img3} alt="apply" />
            <h3>Apply with confidence</h3>
            <p>Submit strong applications with our guidance and document support.</p>
          </div>
        </div>
      </section>

      <section className="partners-section">
        <div className="partners-left">
          <h2>Our <span>Partners</span></h2>
          <p>
            We work with trusted organizations to connect students with scholarships, internships, and career support.
          </p>
          <button className="btn-secondary" onClick={() => navigate("/contact")}>Become a Partner</button>
        </div>
        <div className="partners-right">
          <div className="logos">
            <img src={sbi} alt="SBI" />
            <img src={infosys} alt="Infosys" />
            <img src={amazon} alt="Amazon" />
            <img src={google} alt="Google" />
            <img src={samsung} alt="Samsung" />
            <img src={apple} alt="Apple" />
            <img src={tcs} alt="TCS" />
            <img src={reliance} alt="Reliance" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
