from flask import Flask, jsonify, render_template, request
import random
import re

app = Flask(__name__)

YT_LINKS = [
    "https://www.youtube.com/watch?v=UrsmFxEIp5k",
    "https://www.youtube.com/watch?v=zOjov-2OZ0E",
    "https://www.youtube.com/watch?v=xiUTqnI6xk8",
    "https://www.youtube.com/watch?v=lkIFF4maKMU",
    "https://www.youtube.com/watch?v=mxT233EdY5c",
    "https://www.youtube.com/watch?v=N0SYCyS2xZA",
    "https://www.youtube.com/watch?v=UoQKTC1eMj8",
    "https://www.youtube.com/watch?v=7TR-FLWNVHY",
    "https://www.youtube.com/watch?v=t2jKcA1OyBE",
    "https://www.youtube.com/watch?v=HoDBb2O0NR0",
    "https://www.youtube.com/watch?v=SqcY0GlETPk",
    "https://www.youtube.com/watch?v=rfscVS0vtbw",
    "https://www.youtube.com/watch?v=hdI2bqOjy3c",
    "https://www.youtube.com/watch?v=vmEHCJofslg"
]



TOTAL_VIDEOS = 200

CHANNELS = [
    "CodeMaster Pro", "JS Academy", "Data Science Hub", "AI Simplified",
]

TAGS = ["all", "react", "javascript", "python", "machine learning", "css"]


# Extract YouTube ID from URL
def extract_id(url):
    match = re.search(r"v=([a-zA-Z0-9_-]+)", url)
    return match.group(1) if match else ""


VIDEOS = []

for i in range(TOTAL_VIDEOS):
    YT = random.choice(YT_LINKS)
    vid = extract_id(YT)

    title = random.choice([
        "React Hooks Full Course – 2025 Edition",
        "Python Data Science Full Bootcamp",
        "JavaScript ES2025 Must-Know Features",
        "Machine Learning Algorithms Explained Simply"
    ])

    channel = random.choice(CHANNELS)
    tag = random.choice(TAGS[1:])
    duration = random.choice(["12:31", "18:02", "8:45", "22:10"])

    VIDEOS.append({
        "id": i,
        "title": title,
        "channel": channel,
        "views": f"{random.randint(100,2000)}K",
        "time": f"{random.randint(1,14)} days ago",
        "thumbnail":f"https://img.youtube.com/vi/{vid}/mqdefault.jpg",  # REAL THUMBNAIL
        "duration": duration,
        "tag": tag,
        "yt": YT,
        "tags": f"{title.lower()} {channel.lower()} {tag.lower()}",
        "description": title.lower()
    })


@app.route("/api/videos")
def get_videos():
    q = request.args.get("q", "").lower()
    tag = request.args.get("tag", "").lower()
    page = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))

    filtered = VIDEOS

    if tag and tag != "all":
        filtered = [v for v in filtered if v["tag"].lower() == tag]

    if q:
        filtered = [
            v for v in filtered
            if q in v["title"].lower()
            or q in v["channel"].lower()
            or q in v.get("tags", "")
            or q in v.get("description", "")
        ]

    start = (page - 1) * per_page
    end = start + per_page

    return jsonify({
        "videos": filtered[start:end],
        "has_more": end < len(filtered)
    })


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)

