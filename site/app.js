let DATA = null;

async function init() {
  const res = await fetch("data.json");
  DATA = await res.json();
  buildNav();
  showLanding();
  setupMobile();
  setupSearch();
  handleRoute();
  window.addEventListener("hashchange", handleRoute);

  if (DATA.buildTime) {
    const d = new Date(DATA.buildTime);
    document.getElementById("build-time").textContent = `Built ${d.toLocaleDateString()}`;
  }

  document.getElementById("btn-full-doc").addEventListener("click", () => {
    location.hash = "#/full";
  });
}

// --- Navigation ---
function buildNav() {
  const nav = document.getElementById("nav");

  // Search
  const searchWrap = document.createElement("div");
  searchWrap.className = "search-wrap";
  searchWrap.innerHTML = '<input type="text" class="search-input" id="search" placeholder="Search topics..." />';
  nav.appendChild(searchWrap);

  DATA.sections.forEach((sec) => {
    const div = document.createElement("div");
    div.className = "nav-section";

    const title = document.createElement("div");
    title.className = "nav-section-title";
    const hasTopics = sec.topics.length > 0;
    title.innerHTML = `<span class="chevron">▶</span> ${sec.title} ${hasTopics ? `<span class="topic-count">${sec.topics.length}</span>` : ""}`;
    title.addEventListener("click", () => {
      title.classList.toggle("open");
      const list = div.querySelector(".nav-topics");
      if (list) list.classList.toggle("open");
    });
    div.appendChild(title);

    if (hasTopics) {
      const list = document.createElement("div");
      list.className = "nav-topics";
      sec.topics.forEach((topic) => {
        const item = document.createElement("div");
        item.className = "nav-topic";
        item.textContent = topic.title;
        item.dataset.id = topic.id;
        item.addEventListener("click", () => {
          location.hash = `#/topic/${topic.id}`;
        });
        list.appendChild(item);
      });
      div.appendChild(list);
    }

    nav.appendChild(div);
  });
}

function setActiveTopic(topicId) {
  document.querySelectorAll(".nav-topic").forEach((el) => {
    el.classList.toggle("active", el.dataset.id === topicId);
  });
  // Open parent section
  if (topicId) {
    const active = document.querySelector(`.nav-topic.active`);
    if (active) {
      const section = active.closest(".nav-section");
      section.querySelector(".nav-section-title").classList.add("open");
      section.querySelector(".nav-topics").classList.add("open");
    }
  }
}

// --- Routing ---
function handleRoute() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/topic/")) {
    const id = hash.replace("#/topic/", "");
    showTopic(id);
  } else if (hash === "#/full") {
    showFullDoc();
  } else {
    showLanding();
  }
  closeMobile();
}

// --- Views ---
function showLanding() {
  setActiveTopic(null);
  const el = document.getElementById("content-inner");
  let html = '<div class="landing">';
  html += "<h1>Matter File</h1>";
  html += '<p class="subtitle">Comprehensive debate research — organized, searchable, and always up to date.</p>';
  html += '<div class="section-cards">';
  DATA.sections.forEach((sec) => {
    html += `<div class="section-card" onclick="location.hash='#/section/${sec.id}'">
      <h3>${sec.title}</h3>
      <p class="count"><strong>${sec.topics.length}</strong> topic${sec.topics.length !== 1 ? "s" : ""}</p>
    </div>`;
  });
  html += "</div></div>";
  el.innerHTML = html;
}

function showTopic(id) {
  setActiveTopic(id);
  const el = document.getElementById("content-inner");
  let topic = null;
  let section = null;
  for (const sec of DATA.sections) {
    const found = sec.topics.find((t) => t.id === id);
    if (found) {
      topic = found;
      section = sec;
      break;
    }
  }
  if (!topic) {
    el.innerHTML = "<p>Topic not found.</p>";
    return;
  }

  // Strip LaTeX commands for web rendering
  let content = topic.content
    .replace(/\\newpage/g, "")
    .replace(/\\tableofcontents/g, "")
    .replace(/\\vspace\{[^}]*\}/g, "");

  const rendered = marked.parse(content);
  el.innerHTML = `
    <div class="breadcrumb">
      <a href="#/">Home</a><span class="sep">/</span>
      <a href="#/section/${section.id}">${section.title}</a><span class="sep">/</span>
      ${topic.title}
    </div>
    <div class="topic-meta">
      <span class="badge">${section.title}</span>
    </div>
    ${rendered}
  `;
  window.scrollTo(0, 0);
}

function showFullDoc() {
  setActiveTopic(null);
  const el = document.getElementById("content-inner");
  if (!DATA.matterFile) {
    el.innerHTML = "<p>Full document not available.</p>";
    return;
  }
  let content = DATA.matterFile
    .replace(/\\newpage/g, "<hr>")
    .replace(/\\tableofcontents/g, "")
    .replace(/\\vspace\{[^}]*\}/g, "");
  el.innerHTML = `
    <div class="breadcrumb">
      <a href="#/">Home</a><span class="sep">/</span>Full Document
    </div>
    ${marked.parse(content)}
  `;
  window.scrollTo(0, 0);
}

// --- Search ---
function setupSearch() {
  const input = document.getElementById("search");
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll(".nav-topic").forEach((el) => {
      const match = !q || el.textContent.toLowerCase().includes(q);
      el.style.display = match ? "" : "none";
    });
    // Open all sections if searching
    if (q) {
      document.querySelectorAll(".nav-section-title").forEach((t) => t.classList.add("open"));
      document.querySelectorAll(".nav-topics").forEach((t) => t.classList.add("open"));
    }
  });
}

// --- Mobile ---
function setupMobile() {
  document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("overlay").classList.add("open");
  });
  document.getElementById("overlay").addEventListener("click", closeMobile);
}
function closeMobile() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
}

// --- Boot ---
document.addEventListener("DOMContentLoaded", init);
