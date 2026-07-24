const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = new Date().getFullYear();
});

function getStoredCart() {
  try {
    return JSON.parse(localStorage.getItem("vrStudioCart")) || {};
  } catch {
    return {};
  }
}

function updateSharedCartBadges() {
  const cart = getStoredCart();
  const count = Object.values(cart).reduce((total, quantity) => total + Number(quantity || 0), 0);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = count;
  });
}

updateSharedCartBadges();
window.addEventListener("storage", updateSharedCartBadges);
