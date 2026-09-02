// TEMPORARILY DISABLED LOGIN CHECK FOR TESTING
// const user = JSON.parse(localStorage.getItem("user"));

// document.addEventListener("DOMContentLoaded", () => {
//   const reviewCard = document.querySelector(".review-card");
//   const welcomeUser = document.getElementById("welcome-user");

//   if (!user) {
//     reviewCard.style.display = "none";

//     welcomeUser.innerHTML = `
//       <div class="login-required">
//         <h2>You must be logged in to write a review.</h2>
//         <a href="login.html" class="login-btn">Log In</a>
//       </div>
//     `;
//     return;
//   }

//   welcomeUser.textContent = `Logged in as ${user.first_name} ${user.last_name}`;
// });


document.getElementById("dark-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});


document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5001/places", {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("place-select");
      data.forEach(place => {
        const option = document.createElement("option");
        option.value = place.place_id;
        option.textContent = place.place_name;
        select.appendChild(option);
      });
    })
    .catch(err => console.log("Error loading places:", err));
});

const textarea = document.getElementById("review-text");
textarea.addEventListener("input", () => {
  textarea.style.transform = "scale(1.01)";
  setTimeout(() => textarea.style.transform = "scale(1)", 120);
});


document.getElementById("submit-review").addEventListener("click", () => {
  const place_id = document.getElementById("place-select").value;
  const rating = document.getElementById("rating-select").value;
  const text = document.getElementById("review-text").value;

  if (!place_id || !rating || !text.trim()) {
    alert("Please fill out all fields.");
    return;
  }

  // TEMPORARY USER FOR TESTING
  const user = { user_id: 999 };

  fetch("http://localhost:5001/reviews/add", {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      place_id: place_id,
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
      document.getElementById("place-select").value = "";
    });
});
