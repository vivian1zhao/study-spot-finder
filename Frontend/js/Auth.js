// auth.js


const AUTH_API_BASE = "http://localhost:5001";

function getStoredUser() {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
}

// Re-fetches the logged-in user's record from the database and refreshes the
// localStorage cache. Falls back to the cached copy only if the network call
// itself fails (e.g. offline) — a missing/invalid role in a successful
// response is treated as authoritative, not swallowed.
async function refreshCurrentUser() {
  const stored = getStoredUser();
  if (!stored || !stored.user_id) return null;

  try {
    const res = await fetch(`${AUTH_API_BASE}/users/${stored.user_id}`);
    if (!res.ok) return stored;

    const fresh = await res.json();
    const merged = { ...stored, ...fresh };
    localStorage.setItem("currentUser", JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.error("Could not refresh current user role:", err);
    return stored;
  }
}

// Gate for admin pages: call once on DOMContentLoaded. Redirects non-admins
// (and logged-out visitors) away instead of silently rendering the page.
async function requireAdminPage(redirectTo = "places.html") {
  const user = await refreshCurrentUser();
    console.log('requireAdminAction check:', user); // TEMP — remove after debugging

  if (!user || user.user_role !== "admin") {
    alert("Admin access required.");
    window.location.href = redirectTo;
    return null;
  }

  return user;
}

// Gate for individual write actions (add/edit/delete). Uses the same
// refreshCurrentUser() call as the page gate above, so an action can never
// disagree with the page that let the user in.
async function requireAdminAction() {
  const user = await refreshCurrentUser();

  if (!user || user.user_role !== "admin") {
    alert("Admin access required.");
    return null;
  }

  return user;
}