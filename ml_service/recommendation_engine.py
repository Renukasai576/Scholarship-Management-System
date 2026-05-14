from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

# Load datasets
try:
    courses_df = pd.read_csv("nptel_courses_dataset_updated.csv")
    recommend_df = pd.read_csv("nptel_recommendations_dataset.csv")
    print(f"✅ Courses loaded: {len(courses_df)} courses")
    print(f"✅ Recommendations loaded: {len(recommend_df)} recommendations")
except Exception as e:
    print(f"❌ Error loading datasets: {e}")
    courses_df = pd.DataFrame()
    recommend_df = pd.DataFrame()

# Calculate recommendation counts
if len(recommend_df) > 0:
    recommend_counts = recommend_df.groupby("courseId").size().reset_index(name="recommendedBy")
    courses_df = courses_df.merge(recommend_counts, on="courseId", how="left")
    courses_df["recommendedBy"] = courses_df["recommendedBy"].fillna(0)
else:
    courses_df["recommendedBy"] = 0

# Prepare text data for TF-IDF
if len(courses_df) > 0:
    course_texts = (
        courses_df["domain"].astype(str) + " " + 
        courses_df["skills"].astype(str) + " " + 
        courses_df["level"].astype(str)
    ).tolist()
    
    # ML Model
    vectorizer = TfidfVectorizer(max_features=100, stop_words='english')
    course_vectors = vectorizer.fit_transform(course_texts)
    print("✅ TF-IDF vectorizer ready")
else:
    course_texts = []
    vectorizer = None
    course_vectors = None

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
    if len(courses_df) == 0 or vectorizer is None:
        return jsonify({"error": "Recommendation system not ready"}), 500
    
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
    for idx, row in courses_df.iterrows():
        score = float(similarity[idx]) if idx < len(similarity) else 0.0
        reasons = []
        course_domain = str(row.get("domain", "")).lower()
        course_skills = str(row.get("skills", "")).split()

        if course_domain and course_domain in user_text_clean:
            reasons.append(f"Matches your interest in {row.get('domain')}")

        matching_skills = user_skills.intersection(set(s.lower() for s in course_skills))
        for skill in list(matching_skills)[:2]:
            reasons.append(f"Uses {skill} (your skill)")

        if course_domain and course_domain in user_goal:
            reasons.append(f"Aligns with your goal in {row.get('domain')}")

        if int(row.get("recommendedBy", 0)) > 10:
            reasons.append("Highly recommended by seniors")

        if not reasons:
            reasons.append("Relevant content to accelerate your learning")

        scored.append({
            "courseId": int(row["courseId"]),
            "title": row["title"],
            "domain": row["domain"],
            "level": row["level"],
            "rating": float(row["rating"]),
            "recommendedBy": int(row.get("recommendedBy", 0)),
            "link": row["link"],
            "matchScore": round(score * 100, 1),
            "matchReasons": reasons[:3]
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
