document.addEventListener("DOMContentLoaded", () => {
  const initialsElement = document.getElementById("user-initials");

  // stop if this page doesn't have the initials circle
  if (!initialsElement) {
    return;
  }

  const initials = localStorage.getItem("userInitials");
  const userId = localStorage.getItem("user_id");

  // if no one's logged in, keep circle hidden
  if (!initials || !userId) {
        return;
  }

  initialsElement.textContent = initials;

  const colorKey = `avatarColor_${userId}`;
  let avatarColor = localStorage.getItem(colorKey);

  if (!avatarColor) {
      avatarColor = localStorage.getItem("avatarColor");
  }

  if (avatarColor) {
      initialsElement.style.backgroundColor = avatarColor;
  }

  initialsElement.hidden = false;
  initialsElement.style.cursor = "pointer";

  initialsElement.addEventListener(
      "click",
      () => {
          window.location.href = "profile.html";
      }
  );
});