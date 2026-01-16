// ================= REGISTER =================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value
    };

    localStorage.setItem("user", JSON.stringify(user));
    alert("Registration successful!");
    window.location.href = "login.html";
  });
}

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (
      savedUser &&
      savedUser.email === email &&
      savedUser.password === password
    ) {
      // ✅ STORE LOGIN STATE + USER NAME
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", savedUser.name);

      alert("Login successful!");
      window.location.href = "../index.html";
    } else {
      alert("Invalid credentials!");
    }
  });
}
