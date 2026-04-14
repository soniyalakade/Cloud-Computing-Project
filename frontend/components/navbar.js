document.addEventListener("DOMContentLoaded", () => {

  const API_BASE = window.API_BASE;

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

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">

          <ul class="navbar-nav ms-auto align-items-lg-center">

            <li class="nav-item">
              <a class="nav-link" href="/index.html">Home</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="/index.html#products">Products</a>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                Categories
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="/category.html?type=men">Men</a></li>
                <li><a class="dropdown-item" href="/category.html?type=women">Women</a></li>
                <li><a class="dropdown-item" href="/category.html?type=footwear">Footwear</a></li>
                <li><a class="dropdown-item" href="/category.html?type=accessories">Accessories</a></li>
              </ul>
            </li>

            <li class="nav-item ms-lg-3">
              <a class="nav-link" href="/cart.html">
                Cart
                <span id="cart-count" class="badge bg-warning text-dark">0</span>
              </a>
            </li>

            ${
              isLoggedIn
                ? `
                <li class="nav-item dropdown ms-lg-3">
                  <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                    👤 ${userName}
                  </a>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><button class="dropdown-item text-danger" id="logoutBtn">Logout</button></li>
                  </ul>
                </li>
                `
                : `
                <li class="nav-item ms-lg-3">
                  <a class="nav-link" href="/auth/login.html">Login</a>
                </li>
                <li class="nav-item ms-2">
                  <a class="nav-link" href="/auth/register.html">Sign Up</a>
                </li>
                `
            }

          </ul>
        </div>
      </div>
    </nav>
  `;

  // logout
  document.addEventListener("click", (e) => {
    if (e.target?.id === "logoutBtn") {
      localStorage.clear();
      window.location.href = "/index.html";
    }
  });

  updateCartCount();
  window.addEventListener("cartUpdated", updateCartCount);
});

async function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (!el) return;

  const API_BASE = window.API_BASE;
  const userId = localStorage.getItem("userId");

  if (!API_BASE || !userId) {
    el.innerText = "0";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/cart/${userId}`);
    const data = await res.json();

    el.innerText = Array.isArray(data) ? data.length : 0;

  } catch (err) {
    console.error("Cart count error:", err);
    el.innerText = "0";
  }
}