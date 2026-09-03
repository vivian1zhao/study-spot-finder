document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:5001";

  const userId = localStorage.getItem("user_id");
  const username = localStorage.getItem("username");
  const reviewLayout = document.querySelector(".review-layout");
  const loginPrompt = document.getElementById("login-prompt");
  const submitButton = document.getElementById("submit-review");
  const darkToggle = document.getElementById("dark-toggle");
  const reviewText = document.getElementById("review-text");
  const characterCount = document.getElementById("character-count");
  const formError = document.getElementById("form-error");

  const ratings = {
    overall_rating: null,
    noise: null,
    seating: null,
    outlets: null,
    wifi: null,
    food: null,
    opening_hours: null,
    parking: null
  };

  const categoryNames = {
    noise: "Noise",
    seating: "Seating",
    outlets: "Outlets",
    wifi: "Wi-Fi",
    food: "Food",
    opening_hours: "Hours",
    parking: "Parking"
  };



  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    darkToggle.textContent = "☀️";
  }

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const darkModeEnabled =
      document.body.classList.contains("dark");

    localStorage.setItem("darkMode", darkModeEnabled);
    darkToggle.textContent = darkModeEnabled ? "☀️" : "🌙";
  });


  if (!userId) {
    reviewLayout.style.display = "none";

    loginPrompt.innerHTML = `
      <div class="login-required-card">
        <h2>You must be logged in to write a review.</h2>
        <a href="login.html" class="login-btn">Log In</a>
      </div>
    `;

    return;
  }


loginPrompt.innerHTML = `
  <p class="logged-in-label">
    Logged in as ${username || "User"}
  </p>
`;


  document.querySelectorAll(".star-control").forEach(control => {
    const ratingKey = control.dataset.ratingKey;

    for (let value = 1; value <= 5; value++) {
      const star = document.createElement("button");

      star.type = "button";
      star.className = "star-button";
      star.textContent = "★";
      star.dataset.value = value;
      star.setAttribute("aria-label", `${value} out of 5`);

      star.addEventListener("mouseenter", () => {
        previewStars(control, value);

        const feedback = document.querySelector(
          `[data-feedback-for="${ratingKey}"]`
        );

        feedback.textContent = getRatingMessage(ratingKey, value);
      });

      star.addEventListener("click", () => {
        ratings[ratingKey] = value;
        renderRatingControl(control);
        updateSummary();

        star.classList.add("selected");

        setTimeout(() => {
          star.classList.remove("selected");
        }, 350);
      });

      control.appendChild(star);
    }

    control.addEventListener("mouseleave", () => {
      renderRatingControl(control);
    });
  });

  function previewStars(control, value) {
    control.querySelectorAll(".star-button").forEach(star => {
      const starValue = Number(star.dataset.value);
      star.classList.toggle("lit", starValue <= value);
    });
  }

  function renderRatingControl(control) {
    const ratingKey = control.dataset.ratingKey;
    const selectedValue = ratings[ratingKey];

    control.querySelectorAll(".star-button").forEach(star => {
      const starValue = Number(star.dataset.value);

      star.classList.toggle(
        "lit",
        selectedValue !== null && starValue <= selectedValue
      );
    });

    const feedback = document.querySelector(
      `[data-feedback-for="${ratingKey}"]`
    );

    if (selectedValue === null) {
      feedback.textContent =
        ratingKey === "overall_rating"
          ? "Hover over a star to begin"
          : "Not rated";
    } else {
      feedback.textContent =
        getRatingMessage(ratingKey, selectedValue);
    }

    if (ratingKey !== "overall_rating") {
      const categoryCard = control.closest(".category-card");

      categoryCard.classList.toggle(
        "has-rating",
        selectedValue !== null
      );
    }
  }

  function getRatingMessage(key, value) {
    if (key === "noise") {
      const noiseMessages = {
        1: "Very loud",
        2: "Mostly loud",
        3: "Moderate noise",
        4: "Quiet",
        5: "Very quiet"
      };

      return noiseMessages[value];
    }

    const messages = {
      1: "Needs improvement",
      2: "Fair",
      3: "Good",
      4: "Great",
      5: "Excellent"
    };

    return messages[value];
  }


  document.querySelectorAll(".clear-rating").forEach(button => {
    button.addEventListener("click", () => {
      const ratingKey = button.dataset.clearRating;
      ratings[ratingKey] = null;

      const control = document.querySelector(
        `[data-rating-key="${ratingKey}"]`
      );

      renderRatingControl(control);
      updateSummary();
    });
  });

  document
    .getElementById("clear-optional")
    .addEventListener("click", () => {
      Object.keys(categoryNames).forEach(key => {
        ratings[key] = null;

        const control = document.querySelector(
          `[data-rating-key="${key}"]`
        );

        renderRatingControl(control);
      });

      updateSummary();
    });

  // ---------------- SUMMARY ----------------

  function updateSummary() {
    const summaryScore = document.getElementById("summary-score");
    const summaryStars = document.getElementById("summary-stars");
    const summaryMessage = document.getElementById("summary-message");
    const scoreRing = document.getElementById("score-ring");
    const summaryCategories =
      document.getElementById("summary-categories");

    const overall = ratings.overall_rating;

    if (overall === null) {
      summaryScore.textContent = "—";
      summaryStars.textContent = "☆☆☆☆☆";
      summaryMessage.textContent =
        "Choose an overall rating to begin.";
      scoreRing.style.setProperty("--score-angle", "0deg");
    } else {
      summaryScore.textContent = overall.toFixed(1);

      summaryStars.textContent =
        "★".repeat(overall) + "☆".repeat(5 - overall);

      summaryMessage.textContent =
        getRatingMessage("overall_rating", overall);

      scoreRing.style.setProperty(
        "--score-angle",
        `${(overall / 5) * 360}deg`
      );
    }

    const completedCategories = Object.keys(categoryNames).filter(
      key => ratings[key] !== null
    );

    document.getElementById("optional-count").textContent =
      completedCategories.length;

    summaryCategories.replaceChildren();

    if (completedCategories.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "empty-summary";
      emptyMessage.textContent =
        "Add any category ratings that matter to you.";

      summaryCategories.appendChild(emptyMessage);
      return;
    }

    completedCategories.forEach(key => {
      const item = document.createElement("div");
      item.className = "summary-item";

      const name = document.createElement("span");
      name.textContent = categoryNames[key];

      const value = document.createElement("span");
      value.textContent = `${ratings[key]} ★`;

      item.append(name, value);
      summaryCategories.appendChild(item);
    });
  }


  reviewText.addEventListener("input", () => {
    characterCount.textContent =
      `${reviewText.value.length} / 250`;
  });


  const urlParameters = new URLSearchParams(window.location.search);
  const preselectedPlaceId = urlParameters.get("place_id");

  loadPlaces();

  async function loadPlaces() {
    try {
      const response = await fetch(`${API_BASE}/places`);

      if (!response.ok) {
        throw new Error("Could not load places.");
      }

      const places = await response.json();
      const placeSelect = document.getElementById("place-select");

      places.forEach(place => {
        const option = document.createElement("option");

        option.value = place.place_id;
        option.textContent = place.place_name;

        if (
          preselectedPlaceId &&
          String(place.place_id) === String(preselectedPlaceId)
        ) {
          option.selected = true;
        }

        placeSelect.appendChild(option);
      });
    } catch (error) {
      showFormError(error.message);
    }
  }


  submitButton.addEventListener("click", async () => {
    const placeId = document.getElementById("place-select").value;
    const comments = reviewText.value.trim();

    hideFormError();

    if (!placeId) {
      showFormError("Please select a study spot.");
      return;
    }

    if (ratings.overall_rating === null) {
      showFormError("Please choose an overall rating.");
      return;
    }

    if (!comments) {
      showFormError("Please write a short review.");
      return;
    }

    if (!userId) {
       showFormError("Your login information is missing a user ID.");
         return;
    }

    const reviewData = {
      place_id: Number(placeId),
      user_id: Number(userId),
      overall_rating: ratings.overall_rating,

      noise: ratings.noise,
      seating: ratings.seating,
      outlets: ratings.outlets,
      wifi: ratings.wifi,
      food: ratings.food,
      opening_hours: ratings.opening_hours,
      parking: ratings.parking,

      comments: comments
    };

    try {
      submitButton.disabled = true;
      submitButton.querySelector("span").textContent =
        "Submitting...";

      const response = await fetch(`${API_BASE}/reviews/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Review could not be submitted."
        );
      }

      showSuccess();
      resetReviewForm(preselectedPlaceId);
    } catch (error) {
      console.error("Review submission error:", error);
      showFormError(error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.querySelector("span").textContent =
        "Submit Review";
    }
  });

  function resetReviewForm(keepSelectedPlaceId) {
    reviewText.value = "";
    characterCount.textContent = "0 / 250";

    ratings.overall_rating = null;

    Object.keys(categoryNames).forEach(key => {
      ratings[key] = null;
    });

    document.querySelectorAll(".star-control").forEach(control => {
      renderRatingControl(control);
    });

    if (!keepSelectedPlaceId) {
      document.getElementById("place-select").value = "";
    }

    updateSummary();
  }

  function showSuccess() {
    const popup = document.getElementById("success-popup");

    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 2800);
  }

  function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  function hideFormError() {
    formError.textContent = "";
    formError.hidden = true;
  }

  updateSummary();
});