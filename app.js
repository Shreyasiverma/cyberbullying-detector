const VIDEO_GRID = document.getElementById("video-grid");
const SEARCH = document.getElementById("search-input");
const SEARCH_BTN = document.getElementById("search-btn");
const CHIPS = document.getElementById("chips");

let page = 1;
let loading = false;
let hasMore = true;

let q = "";
let tag = "all";

let lastLoadedVideos = [];

// Load chips
fetch("/api/videos?per_page=1")
    .then(() => {
        CHIPS.innerHTML = `
            <button class="chip active" data-tag="all">All</button>
            <button class="chip" data-tag="react">React</button>
            <button class="chip" data-tag="javascript">JavaScript</button>
            <button class="chip" data-tag="python">Python</button>
            <button class="chip" data-tag="machine learning">Machine Learning</button>
            <button class="chip" data-tag="css">CSS</button>
        `;
    });

    // === Subscription Channels ===
const SUBSCRIPTIONS = [
    "CodeMaster Pro",
    "JS Academy",
    "AI Simplified",
    "Data Science Hub",
    "Tech World",
    "Programming Hub",
    "Web Dev Daily"
];

// === Online profile images ===
const SUBSCRIPTION_ICONS = {
    "CodeMaster Pro": "https://i.pravatar.cc/100?img=1",
    "JS Academy": "https://i.pravatar.cc/100?img=2",
    "AI Simplified": "https://i.pravatar.cc/100?img=3",
    "Data Science Hub": "https://i.pravatar.cc/100?img=4",
    "Tech World": "https://i.pravatar.cc/100?img=5",
    "Programming Hub": "https://i.pravatar.cc/100?img=6",
    "Web Dev Daily": "https://i.pravatar.cc/100?img=7"
};

function loadSubscriptions() {
    const ul = document.getElementById("subs-list");
    ul.innerHTML = "";

    SUBSCRIPTIONS.forEach(name => {
        const li = document.createElement("li");

        li.innerHTML = `
            <img class="sub-icon-img" src="${SUBSCRIPTION_ICONS[name]}" alt="${name}">
            <span>${name}</span>
        `;

        li.addEventListener("click", () => {
            tag = "";
            q = name.toLowerCase();
            SEARCH.value = "";
            page = 1;
            VIDEO_GRID.innerHTML = "";
            loadVideos();
        });

        ul.appendChild(li);
    });
}

// Call it once on page load
loadSubscriptions();


// Apply search
function applySearch() {
    q = SEARCH.value.trim().toLowerCase();
    tag = "all";
    page = 1;
    VIDEO_GRID.innerHTML = "";
    lastLoadedVideos = [];
    loadVideos();
}

// Search events
SEARCH_BTN.addEventListener("click", applySearch);
SEARCH.addEventListener("keyup", (e) => {
    if (e.key === "Enter") applySearch();
});

// Tag filter click
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("chip")) {
        document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        e.target.classList.add("active");

        tag = e.target.dataset.tag;
        q = "";
        SEARCH.value = "";

        page = 1;
        VIDEO_GRID.innerHTML = "";
        lastLoadedVideos = [];

        loadVideos();
    }
});

// Fetch videos API
function loadVideos() {
    if (loading || !hasMore) return;
    loading = true;

    fetch(`/api/videos?q=${q}&tag=${tag}&page=${page}&per_page=20`)
        .then(res => res.json())
        .then(data => {
            data.videos.forEach(addVideoCard);
            hasMore = data.has_more;
            page++;
            loading = false;
        })
        .catch(() => {
            VIDEO_GRID.innerHTML = "<p>Failed to load videos.</p>";
        });
}

// Add video card to the UI
function addVideoCard(v) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
        <a href="${v.yt}" target="_blank">
            <img class="thumbnail" src="${v.thumbnail}">
            <span class="duration">${v.duration}</span>
        </a>
        <div class="info">
            <div class="avatar">${v.channel[0]}</div>
            <div class="meta">
                <h3 class="title">${v.title}</h3>
                <p class="sub">${v.channel}</p>
                <p class="sub">${v.views} views • ${v.time}</p>
            </div>
        </div>
    `;
    VIDEO_GRID.appendChild(div);
}

// Infinite scroll
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadVideos();
    }
});



// === Theme Toggle ===
const themeToggle = document.getElementById("theme-toggle");

// Load theme from localStorage
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "🌞";
}

// Toggle theme
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "🌞";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌓";
        localStorage.setItem("theme", "light");
    }
});

// Initial load
loadVideos();