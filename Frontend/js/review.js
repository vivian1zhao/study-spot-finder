document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const reviewCard = document.querySelector(".review-card");
  const loginPrompt = document.getElementById("login-prompt");

  if (!user) {
    reviewCard.style.display = "none";
    loginPrompt.innerHTML = `
      <div class="login-required-card">
        <h2>You must be logged in to write a review.</h2>
        <a href="login.html" class="login-btn">Log In</a>
      </div>
    `;
    return;
  }

  loginPrompt.innerHTML = `
    <p class="logged-in-label">Logged in as ${user.username}</p>
  `;

  const urlParams = new URLSearchParams(window.location.search);
  const preselectedPlaceId = urlParams.get("place_id");

  fetch("http://localhost:5001/places")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("place-select");

      data.forEach(place => {
        const option = document.createElement("option");
        option.value = place.place_id;
        option.textContent = place.place_name;

        if (preselectedPlaceId && String(place.place_id) === String(preselectedPlaceId)) {
          option.selected = true;
        }

        select.appendChild(option);
      });
    });

  document.getElementById("submit-review").addEventListener("click", () => {
    const place_id = document.getElementById("place-select").value;
    const rating = document.getElementById("rating-select").value;
    const text = document.getElementById("review-text").value;

    if (!place_id || !rating || !text.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    fetch("http://localhost:5001/reviews/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        place_id,
        user_id: user.user_id,
        overall_rating: rating,
        noise: 0,
        seating: 0,
        outlets: 0,
        wifi: 0,
        food: 0,
        opening_hours: "",
        parking: "",
        comments: text
      })
    })
      .then(res => res.json())
      .then(() => {
        const popup = document.getElementById("success-popup");
        popup.classList.add("show");
        setTimeout(() => popup.classList.remove("show"), 2000);

        document.getElementById("review-text").value = "";
        document.getElementById("rating-select").value = "";
        if (!preselectedPlaceId) {
          document.getElementById("place-select").value = "";
        }
      });
  });
});
