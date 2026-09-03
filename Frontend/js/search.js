document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("search-btn");
  const citySelect = document.getElementById("city-select");
  const typeSelect = document.getElementById("type-select");
  const resultsContainer = document.getElementById("results-container");
  const darkToggle = document.getElementById("dark-toggle");
  const floatingIcons = document.querySelector(".floating-icons");

  const icons = ["📚", "✏️", "☕", "💡", "🎧"];

  if (floatingIcons) {
    for (let i = 0; i < 18; i++) {
      const icon = document.createElement("div");

      icon.className = "icon";
      icon.textContent =
        icons[Math.floor(Math.random() * icons.length)];

      icon.style.left = Math.random() * 100 + "vw";
      icon.style.top = Math.random() * 100 + "vh";
      icon.style.animationDuration =
        10 + Math.random() * 10 + "s";
      icon.style.animationDelay =
        Math.random() * 5 + "s";

      floatingIcons.appendChild(icon);
    }
  }

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  searchButton.addEventListener("click", async () => {
    const city = citySelect.value;
    const type = typeSelect.value;

    resultsContainer.innerHTML = "<p>Searching...</p>";
    searchButton.disabled = true;

    const searchParameters = new URLSearchParams();

    if (city) {
      searchParameters.append("city", city);
    }

    if (type) {
      searchParameters.append("type", type);
    }

    const url =
      `/api/places/search?${searchParameters.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Backend returned status ${response.status}`
        );
      }

      const places = await response.json();

      resultsContainer.innerHTML = "";

      if (!Array.isArray(places)) {
        throw new Error("Backend did not return a list");
      }

      if (places.length === 0) {
        resultsContainer.innerHTML = `
          <div class="no-results">
            <div class="no-results-icon">🔎</div>

            <h2>No study spots found</h2>

            <p>
              We couldn't find a match for those filters.
              Try choosing a different city or place type.
            </p>
          </div>
        `;

        return;
      }

      places.forEach(place => {
        const card = document.createElement("div");
        card.className = "result-card";

        const rating =
          place.avg_rating === null
            ? "N/A"
            : Number(place.avg_rating).toFixed(1);

        card.innerHTML = `
          <div class="result-name">
            ${place.place_name}
          </div>

          <div>
            📍 ${place.address}, ${place.city}, ${place.state}
          </div>

          <div>
            🪑 Type: ${place.place_type}
          </div>

          <div>
            ⭐ ${rating}${rating === "N/A" ? "" : " / 5"}
          </div>
        `;

        resultsContainer.appendChild(card);
      });
    } catch (error) {
      console.error("Search error:", error);

      resultsContainer.innerHTML = `
        <p class="no-results">
          No matching study spots were found.
        </p>
      `;
    } finally {
      searchButton.disabled = false;
    }
  });
});