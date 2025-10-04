// Define API URLs for each category
const API_URLS = {
  all: "https://api.collection.nfsa.gov.au/search?query=creator",
  instrumentalist:
    "https://api.collection.nfsa.gov.au/search/credits.role=Instrumentalist",
  composer: "https://api.collection.nfsa.gov.au/search/credits.role=Composer",
  broadcaster:
    "https://api.collection.nfsa.gov.au/search/credits.role=Broadcaster",
  producer: "https://api.collection.nfsa.gov.au/search/credits.role=Producer",
};
let currentUrl = API_URLS.all;

async function loadCreators(url = currentUrl) {
  const resultsContainer = document.getElementById("results");
  if (!resultsContainer) return;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const results = data.results || [];
    resultsContainer.innerHTML = ""; // Clear existing content

    let found = false;

    results.forEach((item) => {
      if (Array.isArray(item.credits)) {
        item.credits.forEach((credit) => {
          found = true;
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <div class="image-wrapper" style="cursor:pointer;">
              <img src="assets/person.jpg" alt="${credit.name || "Unknown"}">
            </div>
            <div class="name-tag">${credit.name || "Unknown"}</div>
            <div class="tag">${credit.role || ""}</div>
          `;
          card.querySelector(".image-wrapper").onclick = () => {
            localStorage.setItem("profileImage", "assets/person.jpg");
            localStorage.setItem(
              "profileTitle",
              credit.name || "Unknown Creator"
            );
            localStorage.setItem(
              "profileDesc",
              credit.about && credit.about.bio
                ? credit.about.bio
                : "No description available."
            );
            window.location.href = "profile.html";
          };
          resultsContainer.appendChild(card);
        });
      }
    });

    if (!found) {
      resultsContainer.innerHTML =
        '<div class="no-results">No results found.</div>';
    }
  } catch (error) {
    console.error("Failed to load creators:", error);
    resultsContainer.innerHTML =
      '<div class="no-results">Failed to load data.</div>';
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => loadCreators(currentUrl));

// Filter buttons
document.querySelectorAll(".filter").forEach((btn) => {
  btn.onclick = () => {
    document
      .querySelectorAll(".filter")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.category || "all";
    currentUrl = API_URLS[cat];
    loadCreators(currentUrl);
  };
});

// Search bar
const searchbar = document.getElementById("searchbar");
if (searchbar) {
  searchbar.addEventListener("input", function () {
    const q = this.value.trim();
    let url = currentUrl;
    if (q) {
      if (url.includes("query=")) {
        url = url.replace(/query=[^&]*/, "query=" + encodeURIComponent(q));
      }
    }
    loadCreators(url);
  });
}
