const API_BASE = "http://fashion-store-alb-769926527.eu-west-3.elb.amazonaws.com";

document.addEventListener("DOMContentLoaded", () => {

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName") || "User";

  document.getElementById("navbar-container").innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark shadow fixed-top">
      <div class="container">

        <a class="navbar-brand fw-bold d-flex align-items-center" href="/index.html">
          <img src="/images/logo.png" alt="Logo" height="40" class="me-2 rounded-pill">
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
              <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
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
                Cart <span id="cart-count" class="badge bg-warning text-dark ms-1">0</span>
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
                    <li>
                      <button class="dropdown-item text-danger" id="logoutBtn">
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
                `
                : `
                <li class="nav-item ms-lg-3"><a class="nav-link" href="/auth/login.html">Login</a></li>
                <li class="nav-item ms-2"><a class="nav-link" href="/auth/register.html">Sign Up</a></li>
                `
            }

          </ul>
        </div>
      </div>
    </nav>
  `;

  // logout (safe binding after DOM injection)
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logoutBtn") {
      localStorage.clear();
      window.location.href = "/index.html";
    }
  });

  updateNavbarCartCount();
  window.addEventListener("cartUpdated", updateNavbarCartCount);
});


/* =======================
   CART COUNT (FIXED)
======================= */
async function updateNavbarCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;

  const userId = localStorage.getItem("userId");

  if (!userId) {
    countEl.innerText = "0";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/cart/${userId}`);

    if (!res.ok) throw new Error("Failed");

    const cart = await res.json();

    countEl.innerText = cart.length || 0;

  } catch (err) {
    console.error("Cart count error:", err);
    countEl.innerText = "0";
  }
}