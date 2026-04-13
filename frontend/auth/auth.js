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

/* ================= REGISTER ================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", data.user.name);

      // ✅ IMPORTANT FIX
      localStorage.setItem("userId", data.user.email);

      alert("Registered successfully!");
      window.location.href = "../index.html";
    } else {
      alert(data.message);
    }
  });
}

/* ================= LOGIN ================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", data.user.name);

      // ✅ FIX
      localStorage.setItem("userId", data.user.email);

      alert("Login successful!");
      window.location.href = "../index.html";
    } else {
      alert(data.message);
    }
  });
}


/* ================= LOGOUT ================= */
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "logoutBtn") {
    localStorage.clear();
    alert("Logged out successfully!");
    window.location.href = "../index.html";
  }
});

/* ================= PAGE PROTECTION ================= */
document.addEventListener("DOMContentLoaded", () => {
  const protectedPage = document.body.dataset.protected === "true";

  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userId = localStorage.getItem("userId");

  if (protectedPage && (!loggedIn || !userId)) {
    localStorage.setItem("redirectAfterLogin", window.location.href);
    window.location.href = "./login.html";
  }
});