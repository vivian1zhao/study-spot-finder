const API_BASE = "/api";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("dark-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  loadFavorites();
});

function getLoggedInUserId() {
  return localStorage.getItem("user_id");
}

function showError(message) {
  const loading = document.getElementById("loading");
  const errorMessage = document.getElementById("error-message");
  const container = document.getElementById("favorites-container");
  const noFavorites = document.getElementById("no-favorites");

  loading.style.display = "none";

  container.replaceChildren();
  container.style.display = "none";

  errorMessage.hidden = false;
  errorMessage.textContent = message;
}

async function loadFavorites() {
  const loading = document.getElementById("loading");
  const errorMessage = document.getElementById("error-message");
  const container = document.getElementById("favorites-container");
  const noFavorites = document.getElementById("no-favorites");
  const userId = getLoggedInUserId();

  errorMessage.hidden = true;
  noFavorites.hidden = true;

  container.replaceChildren();
  container.style.display = "grid";

  if (!userId) {
    showError("Log in to see your favorites.");
    return;
  }

  loading.style.display = "block";

  try {
    const response = await fetch(
        `${API_BASE}/users/${userId}/favorites`
    );

    if (!response.ok) {
      throw new Error("Failed to load favorites");
    }

    const favorites = await response.json();

    loading.style.display = "none";

    if (!Array.isArray(favorites)) {
      showError("Backend returned invalid data.");
      return;
    }

    if (favorites.length === 0) {
      container.style.display = "none";
      noFavorites.hidden = false;
      return;
    }

    favorites.forEach((place) => {
      container.appendChild(createFavoriteCard(place, userId));
    });
  } catch (error) {
    console.error(error);
    showError("Could not load favorites. Try again later.");
  }
}

function createFavoriteCard(place, userId) {
  const card = document.createElement("div");
  card.className = "place-card";

  const name = document.createElement("div");
  name.className = "place-name";
  name.textContent = place.place_name;

  const city = document.createElement("div");
  city.className = "place-info";
  city.textContent = `📍 ${place.city}, ${place.state}`;

  const type = document.createElement("div");
  type.className = "place-info";
  type.textContent = `🪑 Type: ${place.place_type}`;

  const address = document.createElement("div");
  address.className = "place-info";
  address.textContent = place.address;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const detailsBtn = document.createElement("button");
  detailsBtn.className = "details-btn";
  detailsBtn.type = "button";
  detailsBtn.textContent = "View Details →";
  detailsBtn.addEventListener("click", () => {
    window.location.href = `place_details.html?id=${place.place_id}`;
  });

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.type = "button";
  removeBtn.textContent = "Remove from Favorites";
  removeBtn.addEventListener("click", () => {
    removeFavorite(userId, place);
  });

  actions.append(detailsBtn, removeBtn);
  card.append(name, city, type, address, actions);
  return card;
}

async function removeFavorite(userId, place) {
  const confirmed = window.confirm(
    `Remove "${place.place_name}" from your favorites?`
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE}/users/${userId}/favorites/${place.place_id}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }

    await loadFavorites();
  } catch (error) {
    console.error(error);
    alert("Unable to remove this favorite. Try again later.");
  }
}
