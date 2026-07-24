const WHATSAPP_NUMBER = "5543991208064";
const CART_KEY = "vrStudioCart";

const products = [
  {
    id: "caneca-classica",
    name: "Caneca personalizada",
    category: "canecas",
    categoryLabel: "Canecas",
    emoji: "☕",
    description: "Caneca clássica para fotos, frases, logos, nomes e temas especiais."
  },
  {
    id: "caneca-magica",
    name: "Caneca mágica",
    category: "canecas",
    categoryLabel: "Canecas",
    emoji: "✨",
    description: "A imagem aparece com a bebida quente, criando uma surpresa especial."
  },
  {
    id: "camiseta-personalizada",
    name: "Camiseta personalizada",
    category: "vestuario",
    categoryLabel: "Vestuário",
    emoji: "👕",
    description: "Para uniformes, eventos, presentes, equipes e divulgações."
  },
  {
    id: "copo-personalizado",
    name: "Copo personalizado",
    category: "acessorios",
    categoryLabel: "Acessórios",
    emoji: "🥤",
    description: "Copos com nomes, temas, personagens, marcas ou mensagens."
  },
  {
    id: "mousepad-personalizado",
    name: "Mousepad personalizado",
    category: "acessorios",
    categoryLabel: "Acessórios",
    emoji: "🖱️",
    description: "Uma opção útil para empresas, gamers, equipes e presentes."
  },
  {
    id: "almofada-personalizada",
    name: "Almofada personalizada",
    category: "decoracao",
    categoryLabel: "Decoração",
    emoji: "🛋️",
    description: "Fotos, homenagens e artes especiais para decorar e presentear."
  },
  {
    id: "garrafa-personalizada",
    name: "Garrafa personalizada",
    category: "acessorios",
    categoryLabel: "Acessórios",
    emoji: "🧴",
    description: "Garrafa prática e exclusiva com nome, logo ou estampa."
  },
  {
    id: "kit-presente",
    name: "Kit presente personalizado",
    category: "decoracao",
    categoryLabel: "Presentes",
    emoji: "🎁",
    description: "Combine diferentes itens em um presente pensado para a ocasião."
  }
];

const productGrid = document.getElementById("product-grid");
const emptyProducts = document.getElementById("empty-products");
const searchInput = document.getElementById("product-search");
const filterButtons = document.querySelectorAll(".filter-button");
const cartDrawer = document.getElementById("carrinho");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const totalUnits = document.getElementById("cart-total-units");
const quoteButton = document.getElementById("quote-button");
const clearCartButton = document.getElementById("clear-cart-button");
const notesInput = document.getElementById("quote-notes");

let activeCategory = "todos";
let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
  updateBadges();
}

function updateBadges() {
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = count;
  });
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const categoryMatches = activeCategory === "todos" || product.category === activeCategory;
    const textMatches = `${product.name} ${product.description} ${product.categoryLabel}`
      .toLowerCase()
      .includes(term);
    return categoryMatches && textMatches;
  });

  productGrid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-art">
        <span class="product-emoji" aria-hidden="true">${product.emoji}</span>
      </div>
      <div class="product-content">
        <span class="product-category">${product.categoryLabel}</span>
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <button class="button button-primary add-button" type="button" data-add-product="${product.id}">
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  `).join("");

  emptyProducts.hidden = filtered.length > 0;
}

function renderCart() {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const unitCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);

  cartItems.innerHTML = entries.map(([productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return "";

    return `
      <article class="cart-item">
        <div class="cart-item-icon" aria-hidden="true">${product.emoji}</div>
        <div>
          <h3>${product.name}</h3>
          <div class="quantity-control" aria-label="Quantidade de ${product.name}">
            <button type="button" data-decrease="${product.id}" aria-label="Diminuir quantidade">−</button>
            <strong>${quantity}</strong>
            <button type="button" data-increase="${product.id}" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <button class="remove-item" type="button" data-remove="${product.id}" aria-label="Remover ${product.name}">
          Remover
        </button>
      </article>
    `;
  }).join("");

  cartEmpty.hidden = entries.length > 0;
  cartItems.hidden = entries.length === 0;
  totalUnits.textContent = unitCount;
  quoteButton.disabled = entries.length === 0;
  clearCartButton.disabled = entries.length === 0;
}

function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart();
  openCart();
}

function changeQuantity(productId, amount) {
  cart[productId] = (cart[productId] || 0) + amount;
  if (cart[productId] <= 0) delete cart[productId];
  saveCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartOverlay.hidden = false;
  document.body.classList.add("cart-locked");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-locked");
}

function buildWhatsAppMessage() {
  const selectedItems = Object.entries(cart)
    .filter(([, quantity]) => quantity > 0)
    .map(([productId, quantity]) => {
      const product = products.find((item) => item.id === productId);
      return product ? `• ${quantity}x ${product.name}` : "";
    })
    .filter(Boolean);

  const notes = notesInput.value.trim();

  return [
    "Olá, VR Studio! 👋",
    "",
    "Gostaria de solicitar uma cotação para os seguintes produtos:",
    "",
    ...selectedItems,
    "",
    `Total de unidades: ${selectedItems.reduce((total, line) => {
      const quantity = Number(line.match(/• (\d+)x/)?.[1] || 0);
      return total + quantity;
    }, 0)}`,
    notes ? "" : null,
    notes ? `Observações: ${notes}` : null,
    "",
    "Podem me informar valores, prazos e opções de personalização?"
  ].filter((line) => line !== null).join("\n");
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product]");
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");
  const removeButton = event.target.closest("[data-remove]");
  const cartOpenButton = event.target.closest(".cart-open-button");
  const cartCloseButton = event.target.closest(".cart-close-button");

  if (addButton) addToCart(addButton.dataset.addProduct);
  if (increaseButton) changeQuantity(increaseButton.dataset.increase, 1);
  if (decreaseButton) changeQuantity(decreaseButton.dataset.decrease, -1);
  if (removeButton) removeFromCart(removeButton.dataset.remove);
  if (cartOpenButton) openCart();
  if (cartCloseButton) closeCart();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

clearCartButton.addEventListener("click", () => {
  cart = {};
  saveCart();
});

quoteButton.addEventListener("click", () => {
  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
});

renderProducts();
renderCart();
updateBadges();

if (window.location.hash === "#carrinho") {
  setTimeout(openCart, 150);
}
