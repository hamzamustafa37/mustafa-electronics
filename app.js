const products = [
  {
    id: 1,
    name: "Pulse wireless headphones",
    category: "Audio",
    price: 89,
    oldPrice: 109,
    visual: "◉",
    badge: "BESTSELLER",
    detail: "Deep sound · 40h battery",
  },
  {
    id: 2,
    name: "Arc mechanical keyboard",
    category: "Accessories",
    price: 74,
    oldPrice: null,
    visual: "▤",
    badge: "NEW",
    detail: "Tactile switches · USB-C",
  },
  {
    id: 3,
    name: "Nova desk monitor light",
    category: "Smart home",
    price: 49,
    oldPrice: 59,
    visual: "⌁",
    badge: null,
    detail: "Warm glow · Touch control",
  },
  {
    id: 4,
    name: "Orbit USB-C hub",
    category: "Computers",
    price: 39,
    oldPrice: null,
    visual: "▣",
    badge: "NEW",
    detail: "7 ports · 4K HDMI",
  },
  {
    id: 5,
    name: "Flow portable speaker",
    category: "Audio",
    price: 64,
    oldPrice: null,
    visual: "◒",
    badge: null,
    detail: "Room-filling · IPX7",
  },
  {
    id: 6,
    name: "Slate laptop stand",
    category: "Accessories",
    price: 45,
    oldPrice: 55,
    visual: "△",
    badge: "-18%",
    detail: "Aluminum · Foldable",
  },
  {
    id: 7,
    name: "Halo smart plug",
    category: "Smart home",
    price: 22,
    oldPrice: null,
    visual: "⌂",
    badge: null,
    detail: "App control · 2 pack",
  },
  {
    id: 8,
    name: "Core webcam pro",
    category: "Computers",
    price: 99,
    oldPrice: null,
    visual: "◉",
    badge: null,
    detail: "1080p · Auto focus",
  },
];

let activeFilter = "All";
let searchTerm = "";
let cart = [];
const grid = document.querySelector("#product-grid");

function renderProducts() {
  const sort = document.querySelector("#sort-products").value;
  let visible = products.filter(
    (product) =>
      (activeFilter === "All" || product.category === activeFilter) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  if (sort === "low") visible.sort((a, b) => a.price - b.price);
  if (sort === "high") visible.sort((a, b) => b.price - a.price);
  grid.innerHTML = visible.length
    ? visible
        .map(
          (product) => `
    <article class="product-card">
      <div class="product-image"><span class="product-visual">${product.visual}</span>${product.badge ? `<span class="badge">${product.badge}</span>` : ""}</div>
      <div class="product-info"><h3>${product.name}</h3><div class="product-meta"><span>${product.detail}</span><span class="product-price">$${product.price}</span></div><button class="product-button" data-add="${product.id}">Add to cart <span>+</span></button></div>
    </article>`,
        )
        .join("")
    : '<p class="empty-cart">No products match that search yet.</p>';
  document
    .querySelectorAll("[data-add]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        addToCart(Number(button.dataset.add)),
      ),
    );
}

function addToCart(id) {
  const item = products.find((product) => product.id === id);
  cart.push(item);
  renderCart();
  openCart();
}

function renderCart() {
  const count = document.querySelector(".cart-count");
  const items = document.querySelector("#cart-items");
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  count.textContent = cart.length;
  items.innerHTML = cart.length
    ? cart
        .map(
          (item) =>
            `<div class="cart-item"><span class="cart-item-visual">${item.visual}</span><div class="cart-item-info"><strong>${item.name}</strong><small>${item.category} · $${item.price}</small></div></div>`,
        )
        .join("")
    : '<p class="empty-cart">Your cart is waiting for something good.</p>';
  document.querySelector("#cart-total").textContent = `$${total.toFixed(2)}`;
}

function openCart() {
  document.querySelector(".cart-drawer").classList.add("open");
  document.querySelector(".drawer-backdrop").classList.add("open");
  document.querySelector(".cart-drawer").setAttribute("aria-hidden", "false");
}
function closeCart() {
  document.querySelector(".cart-drawer").classList.remove("open");
  document.querySelector(".drawer-backdrop").classList.remove("open");
  document.querySelector(".cart-drawer").setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".filter").forEach((button) =>
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document
      .querySelectorAll(".filter")
      .forEach((item) => item.classList.toggle("active", item === button));
    renderProducts();
  }),
);
document.querySelectorAll(".category-card").forEach((button) =>
  button.addEventListener("click", () => {
    activeFilter = button.dataset.category;
    document
      .querySelectorAll(".filter")
      .forEach((item) =>
        item.classList.toggle("active", item.dataset.filter === activeFilter),
      );
    document.querySelector("#shop").scrollIntoView({ behavior: "smooth" });
    renderProducts();
  }),
);
document.querySelector("#product-search").addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderProducts();
});
document
  .querySelector("#sort-products")
  .addEventListener("change", renderProducts);
document
  .querySelector("[data-focus-search]")
  .addEventListener("click", () =>
    document.querySelector("#product-search").focus(),
  );
document.querySelector("[data-open-cart]").addEventListener("click", openCart);
document
  .querySelectorAll("[data-close-cart]")
  .forEach((button) => button.addEventListener("click", closeCart));
document
  .querySelector(".checkout-button")
  .addEventListener("click", () =>
    alert("Thanks for trying the demo. Checkout is ready to connect."),
  );
renderProducts();
