// admin_users.js


const API_BASE = "/api";
const VALID_ROLES = ["admin", "user"];

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("user-container");
  const loading = document.getElementById("loading");
  const lookupForm = document.getElementById("lookup-form");
  const lookupInput = document.getElementById("lookup-query");

  // Page-level gate: redirects non-admins away before anything else runs.
  const pageUser = await requireAdminPage("places.html");
  if (!pageUser) return;

  if (lookupForm) {
    lookupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = lookupInput.value.trim();
      if (!query) return;

      // Pure digits -> treat as a user_id lookup. Anything else -> name search.
      if (/^\d+$/.test(query)) {
        loadUserById(query);
      } else {
        searchUsersByName(query);
      }
    });
  }

  // ---------- Lookup by exact ID ----------
  function loadUserById(userId) {
    container.innerHTML = "";
    loading.style.display = "block";

    fetch(`${API_BASE}/users/${userId}`)
      .then(res => {
        if (res.status === 404) throw new Error("not-found");
        if (!res.ok) throw new Error("Backend returned an error");
        return res.json();
      })
      .then(user => {
        loading.style.display = "none";
        renderUser(user);
      })
      .catch(err => {
        loading.style.display = "none";
        if (err.message === "not-found") {
          container.innerHTML = "<p>User not found.</p>";
        } else {
          container.innerHTML = "<p>Could not load user. Try again later.</p>";
        }
        console.error("Fetch error:", err);
      });
  }

  // ---------- Search by name (or partial username) ----------
  async function searchUsersByName(query) {
    const currentUser = await requireAdminAction();
    if (!currentUser) return;

    container.innerHTML = "";
    loading.style.display = "block";

    fetch(`${API_BASE}/admin/users/search?q=${encodeURIComponent(query)}`, {
      headers: { "X-User-Role": currentUser.user_role }
    })
      .then(res => {
        if (!res.ok) throw new Error("Backend returned an error");
        return res.json();
      })
      .then(users => {
        loading.style.display = "none";

        if (!Array.isArray(users) || users.length === 0) {
          container.innerHTML = "<p>No matching users found.</p>";
          return;
        }

        users.forEach(user => renderUser(user));
      })
      .catch(err => {
        loading.style.display = "none";
        container.innerHTML = "<p>Could not search users. Try again later.</p>";
        console.error("Search error:", err);
      });
  }

  // ---------- Render a user card ----------
  function renderUser(user) {
    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
      <div class="user-name">${user.fname} ${user.lname}</div>
      <div class="user-info">👤 ${user.username}</div>
      <div class="user-info">✉️ ${user.email || "N/A"}</div>
      <div class="user-info">📍 ${user.city || "N/A"}, ${user.state || "N/A"}</div>
      <div class="user-info">🔑 Role: ${user.user_role || "N/A"}</div>
      <button class="edit-btn" data-id="${user.user_id}">Edit</button>
      <button class="delete-btn" data-id="${user.user_id}">Delete</button>
    `;

    container.appendChild(card);

    card.querySelector(".edit-btn").addEventListener("click", () => {
       window.location.href = `edit_users.html?id=${encodeURIComponent(user.user_id)}`;
});
    

    card.querySelector(".delete-btn").addEventListener("click", () => {
      deleteUser(user.user_id);
    });
  }

  // ---------- Edit / Delete handlers ----------
  async function editUser(user) {
    const currentUser = await requireAdminAction();
    if (!currentUser) return;

    const fname = prompt("First name:", user.fname);
    if (fname === null) return;
    const lname = prompt("Last name:", user.lname);
    if (lname === null) return;
    const email = prompt("Email:", user.email || "");
    if (email === null) return;

    let user_role = prompt(
      `User role (${VALID_ROLES.join(" / ")}):`,
      user.user_role || "user"
    );
    if (user_role === null) return;
    user_role = user_role.trim().toLowerCase();

    if (!VALID_ROLES.includes(user_role)) {
      alert(`Role must be one of: ${VALID_ROLES.join(", ")}`);
      return;
    }

    fetch(`${API_BASE}/admin/users/${user.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-User-Role": currentUser.user_role
      },
      body: JSON.stringify({ fname, lname, email, user_role })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update user");
        return res.json();
      })
      .then(() => {
        // If the admin just edited their own account, refresh the stored
        // currentUser so future admin checks reflect the change immediately.
        if (String(currentUser.user_id) === String(user.user_id)) {
          const updated = { ...currentUser, fname, lname, email, user_role };
          localStorage.setItem("currentUser", JSON.stringify(updated));
        }
        loadUserById(user.user_id);
      })
      .catch(err => {
        console.error("Edit user error:", err);
        alert("Could not update user. Try again later.");
      });
  }

  async function deleteUser(userId) {
    const currentUser = await requireAdminAction();
    if (!currentUser) return;

    if (String(currentUser.user_id) === String(userId)) {
      alert("You cannot delete your own admin account.");
      return;
    }

    if (!confirm("Delete this user? This cannot be undone.")) return;

    // fetch(`${API_BASE}/admin/users/${userId}`, {
    //   method: "DELETE",
    //   headers: { "X-User-Role": currentUser.user_role }
    // })

    fetch(`${API_BASE}/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-User-Role": currentUser.user_role
      },
      body: JSON.stringify({
        user_id: currentUser.user_id
      })
    })

      .then(res => {
        if (!res.ok) throw new Error("Failed to delete user");
        return res.json();
      })
      .then(() => {
        container.innerHTML = "<p>User deleted.</p>";
      })
      .catch(err => {
        console.error("Delete user error:", err);
        alert("Could not delete user. Try again later.");
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