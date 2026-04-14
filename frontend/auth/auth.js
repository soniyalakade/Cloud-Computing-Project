/* =======================
   HELPERS
======================= */
function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function getCurrentUser() {
  return {
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName")
  };
}

/* =======================
   REGISTER
======================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userId", data.user.email);

        alert("Registered successfully!");
        window.location.href = "../index.html";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Server not reachable");
    }
  });
}

/* =======================
   LOGIN
======================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    try {
      const res = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userId", data.user.email);

        alert("Login successful!");
        window.location.href = "../index.html";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server not reachable");
    }
  });
}

/* =======================
   LOGOUT
======================= */
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "logoutBtn") {
    localStorage.clear();
    alert("Logged out successfully!");
    window.location.href = "../index.html";
  }
});

/* =======================
   PAGE PROTECTION
======================= */
document.addEventListener("DOMContentLoaded", () => {
  const protectedPage = document.body.dataset.protected === "true";

  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userId = localStorage.getItem("userId");

  if (protectedPage && (!loggedIn || !userId)) {
    localStorage.setItem("redirectAfterLogin", window.location.href);
    window.location.href = "./login.html";
  }
});