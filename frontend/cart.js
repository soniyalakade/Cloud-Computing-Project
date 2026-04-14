document.addEventListener("DOMContentLoaded", () => {

  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Login required");
    window.location.href = "./auth/login.html";
    return;
  }

  // ================= SAFE API BASE =================
  const API_BASE = window.API_BASE;

  if (!API_BASE) {
    console.error("API_BASE not found. Check config.js");
    return;
  }

  const cartItems = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");
  const breakdownEl = document.getElementById("price-breakdown");

  // ================= LOAD CART =================
  async function loadCart() {
    try {
      const res = await fetch(`${API_BASE}/api/cart/${userId}`);

      if (!res.ok) throw new Error("Failed to load cart");

      const cart = await res.json();

      cartItems.innerHTML = "";
      breakdownEl.innerHTML = "";

      let total = 0;

      if (!Array.isArray(cart) || cart.length === 0) {
        cartItems.innerHTML = `
          <p class="text-center text-muted">Your cart is empty</p>
        `;
        totalPriceEl.innerText = "0";
        return;
      }

      cart.forEach(item => {

        const price = Number(item.price || 0);
        const qty = Number(item.quantity || 1);
        const subtotal = price * qty;

        total += subtotal;

        // ================= CART CARD =================
        const col = document.createElement("div");
        col.className = "col-md-6 mb-4";

        col.innerHTML = `
          <div class="card h-100 shadow-sm">

            <img src="${item.image || item.imageUrl}" 
                 class="card-img-top p-3"
                 style="height:200px; object-fit:contain;">

            <div class="card-body text-center">

              <h5 class="fw-semibold">${item.name || "Product"}</h5>

              <p class="text-muted">
                ₹${price} × ${qty}
              </p>

              <p class="fw-bold">
                Subtotal: ₹${subtotal}
              </p>

              <button class="btn btn-danger btn-sm remove-btn"
                      data-id="${item.productId}">
                Remove
              </button>

            </div>
          </div>
        `;

        cartItems.appendChild(col);

        // ================= PRICE BREAKDOWN =================
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between";

        li.innerHTML = `
          <span>${item.name} × ${qty}</span>
          <span>₹${subtotal}</span>
        `;

        breakdownEl.appendChild(li);
      });

      totalPriceEl.innerText = total;

      attachRemove();

    } catch (err) {
      console.error("Cart load error:", err);

      cartItems.innerHTML = `
        <p class="text-danger text-center">Failed to load cart</p>
      `;
    }
  }

  // ================= REMOVE ITEM =================
  function attachRemove() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", async () => {

        const productId = btn.dataset.id;

        try {
          const res = await fetch(
            `${API_BASE}/api/cart/${userId}/${productId}`,
            { method: "DELETE" }
          );

          if (!res.ok) throw new Error("Delete failed");

          await loadCart();
          window.dispatchEvent(new Event("cartUpdated"));
          

        } catch (err) {
          console.error("Remove error:", err);
          alert("Failed to remove item");
        }
      });
    });
  }

  // ================= CHECKOUT =================
checkoutBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_BASE}/api/cart/${userId}`);

    const cart = await res.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      alert("Cart empty");
      return;
    }

    const clearRes = await fetch(
      `${API_BASE}/api/cart/${userId}/clear`,
      { method: "DELETE" }
    );

    const result = await clearRes.json();

    console.log("CLEAR RESULT:", result);

    if (!clearRes.ok) throw new Error("Clear failed");

    alert(`Order placed! ${result.deleted || 0} items removed`);

    await loadCart();

    window.dispatchEvent(new Event("cartUpdated"));
    setTimeout(() => window.dispatchEvent(new Event("cartUpdated")), 300);

  } catch (err) {
    console.error(err);
    alert("Checkout failed");
  }
});

  loadCart();
});