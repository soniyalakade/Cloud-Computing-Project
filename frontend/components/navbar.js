document.addEventListener("DOMContentLoaded", () => {

  const API_BASE = window.API_BASE;
  const userId = localStorage.getItem("userId");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName") || "User";

  const container = document.getElementById("navbar-container");
  if (!container) return;

  container.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top">
      <div class="container">

        <a class="navbar-brand fw-bold" href="/index.html">
          FashionStore
        </a>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">

            <li class="nav-item">
              <a class="nav-link" href="/index.html">Home</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/index.html#products">Products</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/cart.html">
                Cart <span id="cart-count" class="badge bg-warning text-dark">0</span>
              </a>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  `;

  updateCartCount();
  window.addEventListener("cartUpdated", updateCartCount);
});

async function updateCartCount() {

  const API_BASE = window.API_BASE;
  const userId = localStorage.getItem("userId");

  const el = document.getElementById("cart-count");
  if (!el) return;

  if (!API_BASE || !userId) {
    el.innerText = "0";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/cart/${userId}`);

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();

    el.innerText = Array.isArray(data) ? data.length : 0;

  } catch (err) {
    console.error("Cart count error:", err);
    el.innerText = "0";
  }
}