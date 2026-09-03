const API_BASE = "/api";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const placeId = params.get("id");
  const darkToggle = document.getElementById("dark-toggle");
  const favoriteBtn = document.getElementById("favorite-btn");

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  if (!placeId) {
    showError("No place was selected. Open this page from Places.");
    return;
  }

  favoriteBtn.addEventListener("click", () => {
    toggleFavorite(placeId);
  });

  loadPlaceDetails(placeId);
});

function showError(message) {
  const loading = document.getElementById("loading");
  const errorMessage = document.getElementById("error-message");

  loading.style.display = "none";
  errorMessage.hidden = false;
  errorMessage.textContent = message;
}

async function loadPlaceDetails(placeId) {
  const loading = document.getElementById("loading");
  loading.style.display = "block";

  try {
    const response = await fetch(`${API_BASE}/places/${placeId}/details`);

    if (!response.ok) {
      throw new Error("Failed to load place details");
    }

    const place = await response.json();

    displayBasicInfo(place);
    displayRatings(place.ratings);
    displayAmenities(place.amenities);
    displayOpeningHours(place.opening_hours);
    displayReviews(place.reviews);
    document.getElementById("write-review-link").href =
      `review.html?place_id=${place.place_id}`;

    document.getElementById("place-header").hidden = false;
    document.getElementById("place-details").hidden = false;

    await refreshFavoriteButton(place.place_id);
  } catch (error) {
    console.error(error);
    showError("Could not load place details. Try again later.");
    return;
  }

  loading.style.display = "none";
}

function displayBasicInfo(place) {
  document.getElementById("place-name").textContent = place.place_name;
  document.getElementById("place-type").textContent =
    `Type: ${place.place_type}`;
  document.getElementById("place-address").textContent =
    `${place.address}, ${place.city}, ${place.state}`;
}

function displayRatings(ratings) {
  if (!ratings) {
    return;
  }

  displayOverallRating(ratings.avg_rating);
  document.getElementById("noise-rating").textContent =
    formatRating(ratings.avg_noise);
  document.getElementById("seating-rating").textContent =
    formatRating(ratings.avg_seating);
  document.getElementById("outlets-rating").textContent =
    formatRating(ratings.avg_outlets);
  document.getElementById("wifi-rating").textContent =
    formatRating(ratings.avg_wifi);
  document.getElementById("food-rating").textContent =
    formatRating(ratings.avg_food);
  document.getElementById("hours-rating").textContent =
    formatRating(ratings.avg_hours);
  document.getElementById("parking-rating").textContent =
    formatRating(ratings.avg_parking);
}

function displayOverallRating(rating) {
  const ratingElement = document.getElementById("overall-rating");
  const starsFilled = document.getElementById("stars-filled");

  if (rating === null || rating === undefined || rating === "") {
    ratingElement.textContent = "N/A";
    starsFilled.style.width = "0%";
    return;
  }

  const value = Number(rating);

  if (Number.isNaN(value)) {
    ratingElement.textContent = "N/A";
    starsFilled.style.width = "0%";
    return;
  }

  ratingElement.textContent = value.toFixed(1);

  const percentage = (value / 5) * 100;
  starsFilled.style.width = `${percentage}%`;
}

function formatRating(rating) {
  if (rating === null || rating === undefined || rating === "") {
    return "N/A";
  }

  const value = Number(rating);
  if (Number.isNaN(value)) {
    return "N/A";
  }

  return `${value.toFixed(1)} ★`;
}

function displayAmenities(amenities) {
  const list = document.getElementById("amenities-list");
  list.replaceChildren();

  if (!amenities || amenities.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No amenities listed";
    list.appendChild(item);
    return;
  }

  amenities.forEach((amenity) => {
    const item = document.createElement("li");
    item.className = "amenity-chip";
    item.textContent = amenity.amenity_name;
    list.appendChild(item);
  });
}

function displayOpeningHours(hours) {
  const container = document.getElementById("opening-hours");
  container.replaceChildren();

  if (!hours || hours.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.textContent = "No opening hours listed.";
    container.appendChild(paragraph);
    return;
  }

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const table = document.createElement("table");
  table.className = "hours-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  const dayHeader = document.createElement("th");
  dayHeader.textContent = "Day";

  const hoursHeader = document.createElement("th");
  hoursHeader.textContent = "Hours";

  headerRow.append(dayHeader, hoursHeader);
  thead.appendChild(headerRow);

  const tbody = document.createElement("tbody");

  hours.forEach((hour) => {
    const row = document.createElement("tr");

    const dayCell = document.createElement("td");
    dayCell.className = "hours-day";
    dayCell.textContent =
      days[hour.day_of_week] || `Day ${hour.day_of_week}`;

    const hoursCell = document.createElement("td");

    if (hour.closed) {
      hoursCell.textContent = "Closed";
      hoursCell.className = "hours-closed";
    } else if (hour.is_24_hours) {
      hoursCell.textContent = "Open 24 Hours";
    } else {
      hoursCell.textContent =
        `${formatTime(hour.open_time)} - ${formatTime(hour.close_time)}`;
    }

    row.append(dayCell, hoursCell);
    tbody.appendChild(row);
  });

  table.append(thead, tbody);
  container.appendChild(table);
}

function formatTime(time) {
  if (!time) {
    return "";
  }

  const [hourString, minute] = String(time).split(":");
  let hour = parseInt(hourString, 10);
  const period = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  if (hour === 0) {
    hour = 12;
  }

  return `${hour}:${minute} ${period}`;
}

function createStarRating(rating) {
  const starRating = document.createElement("div");
  starRating.className = "star-rating review-stars";

  const background = document.createElement("div");
  background.className = "stars-background";
  background.textContent = "★★★★★";

  const filled = document.createElement("div");
  filled.className = "stars-filled";
  filled.textContent = "★★★★★";

  const value = Number(rating);

  if (!Number.isNaN(value)) {
    const percentage = (value / 5) * 100;
    filled.style.width = `${percentage}%`;
  } else {
    filled.style.width = "0%";
  }

  starRating.append(background, filled);

  return starRating;
}

function displayReviews(reviews) {
  const container = document.getElementById("reviews-container");
  container.replaceChildren();

  if (!reviews || reviews.length === 0) {
    const paragraph = document.createElement("p");
    paragraph.textContent = "No reviews yet.";
    container.appendChild(paragraph);
    return;
  }

  reviews.forEach((review) => {
    const card = document.createElement("div");
    card.classList.add("review-card");

    const name = document.createElement("h3");
    name.textContent = `${review.fname} ${review.lname}`;

    // gives five stars filled based on rating number
    const rating = document.createElement("div");
    rating.className = "review-rating";

    const ratingLabel = document.createElement("strong");
    ratingLabel.textContent = `Overall Rating: ${Number(review.overall_rating).toFixed(1)}`;

    const stars = createStarRating(review.overall_rating);

    rating.append(ratingLabel, stars);


    const comments = document.createElement("p");
    comments.textContent = review.comments || "No comment provided.";

    card.append(name, rating, comments);
    container.appendChild(card);
  });
}

function getLoggedInUserId() {
  return localStorage.getItem("user_id");
}

async function refreshFavoriteButton(placeId) {
  const button = document.getElementById("favorite-btn");
  const userId = getLoggedInUserId();

  if (!userId) {
    button.textContent = "Add to Favorites";
    button.dataset.favorited = "false";
    return;
  }

  const response = await fetch(`${API_BASE}/users/${userId}/favorites`);
  if (!response.ok) {
    return;
  }

  const favorites = await response.json();
  const isFavorite = favorites.some(
    (favorite) => String(favorite.place_id) === String(placeId)
  );

  button.dataset.favorited = String(isFavorite);
  button.textContent = isFavorite ? "Remove from Favorites" : "Add to Favorites";
}

async function toggleFavorite(placeId) {
  const userId = getLoggedInUserId();
  const button = document.getElementById("favorite-btn");

  if (!userId) {
    alert("Log in to save favorites.");
    return;
  }

  const isFavorite = button.dataset.favorited === "true";
  const method = isFavorite ? "DELETE" : "POST";
  const response = await fetch(
    `${API_BASE}/users/${userId}/favorites/${placeId}`,
    { method }
  );

  if (!response.ok && response.status !== 409) {
    alert("Unable to update favorites.");
    return;
  }

  await refreshFavoriteButton(placeId);
}
