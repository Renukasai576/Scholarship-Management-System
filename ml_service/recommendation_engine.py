from flask import Flask, request, jsonify
from flask_cors import CORS
import json

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load dataset
with open("courses.json") as f:
    courses = json.load(f)

# Prepare text data
course_texts = [
    c["domain"] + " " + c["skills"] + " " + c["level"]
    for c in courses
]

# ML Model
vectorizer = TfidfVectorizer()
course_vectors = vectorizer.fit_transform(course_texts)

# Career paths
career_paths = {
    "AI": [
        "Learn Python",
        "Learn Statistics",
        "Learn Machine Learning",
        "Build AI Projects"
    ],
    "Web": [
        "Learn HTML & CSS",
        "Learn JavaScript",
        "Learn React",
        "Build Websites"
    ],
    "Data Science": [
        "Learn Python",
        "Learn Data Analysis",
        "Learn Visualization",
        "Work on Datasets"
    ],
    "Cybersecurity": [
        "Learn Networking",
        "Learn Security Basics",
        "Practice Ethical Hacking"
    ]
}

@app.route("/")
def home():
    return "ML Course Recommendation Service Running 🚀"

@app.route("/course-recommend", methods=["POST"])
def recommend_courses():
    data = request.json

    user_text = (
        data.get("interests", "") + " " +
        data.get("skills", "") + " " +
        data.get("goal", "")
    )

    user_vector = vectorizer.transform([user_text])

    similarity = cosine_similarity(user_vector, course_vectors)[0]

    user_text_clean = user_text.lower()
    user_skills = set(x.strip().lower() for x in data.get("skills", "").split())
    user_goal = data.get("goal", "").lower()

    scored = []
    for idx, course in enumerate(courses):
        score = float(similarity[idx]) if idx < len(similarity) else 0.0
        reasons = []
        course_domain = course.get("domain", "").lower()
        course_skills = set(course.get("skills", "").split())

        if course_domain and course_domain in user_text_clean:
            reasons.append(f"Matches your interest in {course.get('domain')}")

        matching_skills = user_skills.intersection(course_skills)
        for skill in matching_skills:
            reasons.append(f"Uses {skill} (your skill)")

        if course_domain and course_domain in user_goal:
            reasons.append(f"Aligns with your goal in {course.get('domain')}")

        if not reasons:
            reasons.append("Relevant content to accelerate your learning")

        scored.append({
            **course,
            "matchScore": round(score * 100, 1),
            "matchReasons": reasons
        })

    recommended = sorted(scored, key=lambda x: x["matchScore"], reverse=True)[:5]

    # Career path based on best match
    top_domain = recommended[0].get("domain", "") if recommended else ""
    path = career_paths.get(top_domain, [])

    return jsonify({
        "courses": recommended,
        "career_path": path
    })

if __name__ == "__main__":
    print("Starting ML Recommendation Engine...")
    print("Service running on http://localhost:5002")
    app.run(host="0.0.0.0", port=5002, debug=False)
