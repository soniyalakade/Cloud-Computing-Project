document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName") || "User";

  document.getElementById("navbar-container").innerHTML = `
    <nav class="navbar navbar-expand-lg custom-navbar fixed-top shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" href="index.html">
          FashionStore
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Home</a>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="cart.html">
                Cart (<span id="cart-count">0</span>)
              </a>
            </li>

            ${
                isLoggedIn
                    ? `
                    <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button"
                        data-bs-toggle="dropdown">
                        👤 ${userName}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                        <span class="dropdown-item-text fw-bold">
                            Hello, ${userName}
                        </span>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                        <a class="dropdown-item text-danger" href="#" id="logoutBtn">
                            Logout
                        </a>
                        </li>
                    </ul>
                    </li>
                `
                    : `
                    <li class="nav-item">
                    <a class="nav-link" href="login.html">Login</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="register.html">Sign Up</a>
                    </li>
                `
                }
          </ul>
        </div>
      </div>
    </nav>
  `;

  // Logout logic
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    });
  }

  updateCartCount();
});

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (countEl) countEl.innerText = cart.length;
}
