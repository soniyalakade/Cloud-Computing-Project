document.addEventListener("DOMContentLoaded", () => {

  // LOGIN CHECK
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
    alert("Please login to view your cart");
    window.location.href = "auth/login.html";
    return;
  }

  const cartItems = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  const breakdownEl = document.getElementById("price-breakdown");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItems.innerHTML =
      `<p class="text-center text-muted">Your cart is empty</p>`;
    breakdownEl.innerHTML = "";
    totalPriceEl.innerText = "0";
    return;
  }

  let total = 0;
  cartItems.innerHTML = "";
  breakdownEl.innerHTML = "";

  cart.forEach((item, index) => {
    const price = Number(item.price) || 0;
    const qty = item.quantity || 1;
    const subtotal = price * qty;

    total += subtotal;

    // PRODUCT CARD
    cartItems.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow">
          <img src="${item.image || item.img}" class="img-fluid p-3" alt="${item.name}">
          <div class="card-body text-center">
            <h5>${item.name}</h5>
            <p>₹${price} × ${qty}</p>
            <p class="fw-bold">Subtotal: ₹${subtotal}</p>
            <button class="btn btn-danger btn-sm"
              onclick="removeFromCart(${index})">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;

    // PRICE BREAKDOWN
    breakdownEl.innerHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <span>${item.name} × ${qty}</span>
        <span>₹${subtotal}</span>
      </li>
    `;
  });

  totalPriceEl.innerText = total;
});

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}
