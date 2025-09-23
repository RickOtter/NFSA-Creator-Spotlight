// NFSA API endpoint
const API_URL =
  "https://api.collection.nfsa.gov.au/search?query=Musician&forms=Music";

// musician: 'https://api.collection.nfsa.gov.au/search?query=musician&forms=Music',
// filmmaker: 'https://api.collection.nfsa.gov.au/search?query=filmmaker&subMedium=Film',
// artist: 'https://api.collection.nfsa.gov.au/search?query=artist&forms=Art work',
//broadcaster: 'https://api.collection.nfsa.gov.au/search?query=broadcaster&subMedium=Radio'

async function loadCreators() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const creators = data.creators || data.results || [];

    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear existing content

    creators.forEach((creator) => {
      // Replaces placeholder data
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${creator.image}" alt="${creator.name}">
        </div>
        <div class="name-tag">${creator.name}</div>
        <div class="tag">${creator.profession}</div>
      `;
      card.querySelector(".image-wrapper").onclick = () => {
        // Pass data via URL
        localStorage.setItem("profileImage", img);
        localStorage.setItem("profileTitle", title);
        localStorage.setItem("profileDesc", desc);
        window.location.href = "profile.html";
      };
      resultsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load creators:", error);
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadCreators);

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
document.getElementById("searchbar").addEventListener("input", function () {
  const q = this.value.trim();
  let url = currentUrl;
  if (q) {
    if (url.includes("query=")) {
      url = url.replace(/query=[^&]*/, "query=" + encodeURIComponent(q));
    }
  }
  loadCreators(url);
});
