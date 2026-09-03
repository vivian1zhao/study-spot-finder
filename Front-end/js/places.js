document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("places-container");
  const loading = document.getElementById("loading");

  loading.style.display = "block";

  fetch("/api/places")
    .then(res => {
      if (!res.ok) throw new Error("Backend returned an error");
      return res.json();
    })
    .then(places => {
      loading.style.display = "none";

      if (!Array.isArray(places)) {
        container.innerHTML = "<p>Backend returned invalid data.</p>";
        return;
      }

      places.forEach(place => {
        const card = document.createElement("div");
        card.className = "place-card";

        card.innerHTML = `
          <div class="place-name">${place.place_name}</div>
          <div class="place-info">📍 ${place.city}</div>
          <div class="place-info">🪑 Type: ${place.place_type}</div>
          <div class="rating">
            ⭐ ${place.avg_rating ? Number(place.avg_rating).toFixed(1) : "N/A"} / 5
          </div>
          <button class="details-btn" data-id="${place.place_id}">
            View Details →
          </button>
        `;

        container.appendChild(card);
      });

      // link button to place_details.html
      container.querySelectorAll(".details-btn").forEach((button) => {
        button.addEventListener("click", () => {
          window.location.href = `place_details.html?id=${button.dataset.id}`;
        });
      });
      
    })
    .catch(err => {
      loading.style.display = "none";
      container.innerHTML = "<p>Could not load places. Try again later.</p>";
      console.error("Fetch error:", err);
    });
});

// Dark mode toggle
document.getElementById("dark-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
