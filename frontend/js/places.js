document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("places-container");
  const loading = document.getElementById("loading");

  loading.style.display = "block";

  fetch("http://localhost:5001/places")
    .then(res => res.json())
    .then(places => {
      loading.style.display = "none"; 

      places.forEach(place => {
        const card = document.createElement("div");
        card.className = "place-card";

        card.innerHTML = `
          <div class="place-name">${place.name}</div>
          <div class="place-info">📍 ${place.city}</div>
          <div class="place-info">🪑 Type: ${place.spot_type}</div>
          <div class="rating">⭐ ${place.avg_rating.toFixed(1)} / 5</div>
          <button class="details-btn" data-id="${place.place_id}">
            View Details →
          </button>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      loading.style.display = "none";
      container.innerHTML = "<p>Could not load places. Try again later.</p>";
      console.error(err);
    });
});

//dark mode toggle
document.getElementById("dark-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
