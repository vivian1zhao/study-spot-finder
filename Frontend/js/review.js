document.addEventListener("DOMContentLoaded", () => {
  const savedUser = localStorage.getItem("user");
  const reviewCard = document.querySelector(".review-card");
  const loginPrompt = document.getElementById("login-prompt");
  const submitButton = document.getElementById("submit-review");
  const darkToggle = document.getElementById("dark-toggle");

  // Dark mode
  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  }

  // User must be logged in
  if (!savedUser) {
    reviewCard.style.display = "none";

    loginPrompt.innerHTML = `
      <div class="login-required-card">
        <h2>You must be logged in to write a review.</h2>
        <a href="login.html" class="login-btn">Log In</a>
      </div>
    `;

    return;
  }

  const user = JSON.parse(savedUser);

  loginPrompt.innerHTML = `
    <p class="logged-in-label">
      Logged in as ${user.username}
    </p>
  `;

  // Check whether a place came from the Details page
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedPlaceId = urlParams.get("place_id");

  // Load places into dropdown
  fetch("http://localhost:5001/places")
    .then(response => {
      if (!response.ok) {
        throw new Error("Could not load places");
      }

      return response.json();
    })
    .then(places => {
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
    })
    .catch(error => {
      console.error("Place loading error:", error);
      alert("Could not load the places.");
    });

  // Submit review
  submitButton.addEventListener("click", async () => {
    const placeId = document.getElementById("place-select").value;
    const rating = document.getElementById("rating-select").value;
    const comments = document
      .getElementById("review-text")
      .value
      .trim();

    if (!placeId || !rating || !comments) {
      alert("Please fill out all fields.");
      return;
    }

    if (!user.user_id) {
      alert("Your logged-in user ID is missing.");
      return;
    }

    const reviewData = {
      place_id: Number(placeId),
      user_id: Number(user.user_id),
      overall_rating: Number(rating),

      // This form does not collect these ratings yet
      noise: null,
      seating: null,
      outlets: null,
      wifi: null,
      food: null,
      opening_hours: null,
      parking: null,

      comments: comments
    };

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      const response = await fetch(
        "http://localhost:5001/reviews/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(reviewData)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "The review could not be submitted."
        );
      }

      const popup = document.getElementById("success-popup");

      popup.classList.add("show");

      setTimeout(() => {
        popup.classList.remove("show");
      }, 2000);

      document.getElementById("review-text").value = "";
      document.getElementById("rating-select").value = "";

      if (!preselectedPlaceId) {
        document.getElementById("place-select").value = "";
      }
    } catch (error) {
      console.error("Review submission error:", error);
      alert(error.message);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Review";
    }
  });
});