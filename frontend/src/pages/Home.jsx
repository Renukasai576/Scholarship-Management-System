import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import img1 from "../assets/1.png";
import img2 from "../assets/2.png";
import img3 from "../assets/3.png";
import Scholarships from "./Scholarship";

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

  // 🔥 STATE FOR STATS
  const [stats, setStats] = useState({
    users: 0,
    scholarships: 0
  });

  // 🔥 FETCH DATA FROM BACKEND
  useEffect(() => {
    API.get("/stats")
      .then(res => {
        setStats({
          users: res.data.totalStudents || res.data.users || 0,
          scholarships: res.data.totalScholarships || res.data.scholarships || 0
        });
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <>

      {/* HERO SECTION */}
      <div className="hero">
        <h1>Find Scholarships Easily 🎓</h1>
        <p>Apply to the best scholarships tailored for you</p>
        <button onClick={() => navigate("/scholarships")}>
          Explore Scholarships
        </button>
      </div>

      {/* 🔥 STATS SECTION */}
      <div className="stats-section">

        <div className="stat-box">
          <h3>Scholarships</h3>
          <h1>{stats.scholarships}+</h1>
        </div>

        <div className="stat-box">
          <h3>Students</h3>
          <h1>{stats.users}+</h1>
        </div>

      </div>

      {/* STEPS SECTION */}
      <div className="steps-section">
        <h2>
          Steps To Follow For Getting <span>A SCHOLARSHIP</span>
        </h2>

        <div className="steps-container">

          <div
            className="step-card"
            onClick={() => navigate("/profile")}
          >
            <img src={img1} alt="register" />
            <h3>Register and Create Your Profile</h3>
            <p>
              Share details and unlock personalized scholarships.
            </p>
          </div>
           {/* STEP 2 → SCHOLARSHIPS */}
          <div
            className="step-card"
            onClick={() => navigate("/scholarships")}
          >
            <img src={img2} alt="search" />
            <h3>Personalized Scholarships</h3>
            <p>
              Get alerts and find scholarships matching your profile.
            </p>
          </div>
           {/* STEP 3 → SCHOLARSHIPS */}
          <div
            className="step-card highlight"
            onClick={() => navigate("/scholarships")}
          >
            <img src={img3} alt="apply" />
            <h3>Apply for Scholarships</h3>
            <p>
              Explore thousands of scholarships tailored to you.
            </p>
          </div>


        </div>
      </div>

      {/* PARTNERS SECTION */}
      <div className="partners-section">

        <div className="partners-left">
          <h2>Our <span>PARTNERS</span></h2>

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

        <div className="partners-right">
          <h2>Become Our <span>PARTNER</span></h2>
          <p>
            As a trusted partner of 200+ organizations, we help students access scholarships,
            mentorship, and education support.
          </p>

          <button>Become a Partner</button>
        </div>

      </div>

    </>
  );
}

export default Home;