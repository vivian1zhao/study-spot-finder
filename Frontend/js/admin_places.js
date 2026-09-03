// admin_places.js
const API_BASE = '/api';


document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("places-container");
  const loading = document.getElementById("loading");
  const addForm = document.getElementById("add-place-form");

  // Page-level gate: redirects non-admins away before anything else runs.
  const pageUser = await requireAdminPage("places.html");
  if (!pageUser) return;

  loadPlaces();

  // ---------- Add Place ----------
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const currentUser = await requireAdminAction();
      if (!currentUser) return;

      console.log('About to send X-User-Role:', currentUser.user_role); // TEMP — remove after debugging

      const newPlace = {
        place_name: document.getElementById("place_name").value,
        place_type: document.getElementById("place_type").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value
      };

      fetch(`${API_BASE}/admin/places`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": currentUser.user_role
        },
        body: JSON.stringify(newPlace)
      })
        .then(res => {
          if (!res.ok) throw new Error("Failed to add place");
          return res.json();
        })
        .then(() => {
          addForm.reset();
          loadPlaces();
        })
        .catch(err => {
          console.error("Add place error:", err);
          alert("Could not add place. Try again later.");
        });
    });
  }

  // ---------- Load / render places ----------
  function loadPlaces() {
    container.innerHTML = "";
    loading.style.display = "block";

    fetch(`${API_BASE}/places`)
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
            <div class="place-info">📍 ${place.city}, ${place.state}</div>
            <div class="place-info">🪑 Type: ${place.place_type}</div>
            <div class="place-info">🏠 ${place.address}</div>
            <div class="rating">
              ⭐ ${place.avg_rating ? Number(place.avg_rating).toFixed(1) : "N/A"} / 5
            </div>
            <button class="edit-btn" data-id="${place.place_id}">Edit</button>
            <button class="delete-btn" data-id="${place.place_id}">Delete</button>
          `;

          container.appendChild(card);
        });

        attachCardListeners(places);
      })
      .catch(err => {
        loading.style.display = "none";
        container.innerHTML = "<p>Could not load places. Try again later.</p>";
        console.error("Fetch error:", err);
      });
  }

  // ---------- Edit / Delete handlers ----------
  function attachCardListeners(places) {
    container.querySelectorAll(".edit-btn").forEach(button => {
  button.addEventListener("click", () => {
    const placeId = button.dataset.id;
    const place = places.find(p => String(p.place_id) === String(placeId));
    // Cache the record client-side since there's no GET /places/<id> endpoint —
    // the edit page falls back to fetching the full /places list if this is missing.
    if (place) {
      sessionStorage.setItem(`editPlace:${placeId}`, JSON.stringify(place));
    }
    window.location.href = `edit_places.html?id=${encodeURIComponent(placeId)}`;
  });
});
      
    container.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", () => {
        deletePlace(button.dataset.id);
      });
    });
  }

  async function editPlace(placeId, place) {
    const currentUser = await requireAdminAction();
    if (!currentUser) return;

    const place_name = prompt("Place name:", place.place_name);
    if (place_name === null) return;
    const place_type = prompt("Place type:", place.place_type);
    if (place_type === null) return;
    const address = prompt("Address:", place.address);
    if (address === null) return;
    const city = prompt("City:", place.city);
    if (city === null) return;
    const state = prompt("State:", place.state);
    if (state === null) return;

    fetch(`${API_BASE}/admin/places/${placeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-Role": currentUser.user_role
      },
      body: JSON.stringify({ place_name, place_type, address, city, state })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update place");
        return res.json();
      })
      .then(() => loadPlaces())
      .catch(err => {
        console.error("Edit place error:", err);
        alert("Could not update place. Try again later.");
      });
  }

  async function deletePlace(placeId) {
    const currentUser = await requireAdminAction();
    if (!currentUser) return;

    if (!confirm("Delete this place? This cannot be undone.")) return;

    fetch(`${API_BASE}/admin/places/${placeId}`, {
      method: "DELETE",
      headers: { "X-User-Role": currentUser.user_role }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to delete place");
        return res.json();
      })
      .then(() => loadPlaces())
      .catch(err => {
        console.error("Delete place error:", err);
        alert("Could not delete place. Try again later.");
      });
  }
});

// Dark mode toggle
const darkToggle = document.getElementById("dark-toggle");
if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}