document.addEventListener("DOMContentLoaded", () => {
  const initialsElement = document.getElementById("user-initials");

  // stop if this page doesn't have the initials circle
  if (!initialsElement) {
    return;
  }

  const initials = localStorage.getItem("userInitials");

  // if no one's logged in, keep circle hidden
  if (!initials) {
    return;
  }

  initialsElement.textContent = initials;
  initialsElement.style.backgroundColor = getInitialsColor(initials);
  initialsElement.hidden = false;
});


function getInitialsColor(initials) {
  const colors = [
    "#4A7C59",
    "#5C6BC0",
    "#8E5EA2",
    "#C96A4A",
    "#3F7C85",
    "#B07A3F",
    "#7A6F9B",
    "#4F8A8B"
  ];

  let total = 0;

  for (let i = 0; i < initials.length; i++) {
    total += initials.charCodeAt(i);
  }

  return colors[total % colors.length];
}