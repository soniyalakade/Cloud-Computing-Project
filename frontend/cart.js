document.addEventListener("DOMContentLoaded", () => {

  const API_BASE = "http://fashion-store-alb-769926527.eu-west-3.elb.amazonaws.com";

  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Login required");
    window.location.href = "./auth/login.html";
    return;
  }

  const cartItems = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");


  // ================= LOAD CART =================
  async function loadCart() {
    try {
      const res = await fetch(`${API_BASE}/api/cart/${userId}`);

      if (!res.ok) throw new Error("Failed to load cart");

      const cart = await res.json();

      cartItems.innerHTML = "";

      let total = 0;

      cart.forEach(item => {

        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "col-md-4 mb-4";

        div.innerHTML = `
          <div class="card shadow">
            <img src="${item.image}" class="card-img-top">
            <div class="card-body text-center">
              <h5>${item.name}</h5>
              <p>₹${item.price}</p>
              <p>Qty: ${item.quantity}</p>

              <button class="btn btn-danger remove-btn" data-id="${item.productId}">
                Remove
              </button>
            </div>
          </div>
        `;

        cartItems.appendChild(div);
      });

      totalPriceEl.innerText = total;

      attachRemove();

    } catch (err) {
      console.error("Cart load error:", err);
      cartItems.innerHTML = "<p class='text-danger'>Failed to load cart</p>";
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

          loadCart();
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

      if (!res.ok) throw new Error("Cart fetch failed");

      const cart = await res.json();

      if (!Array.isArray(cart) || cart.length === 0) {
        alert("Cart empty");
        return;
      }

      const clearRes = await fetch(
        `${API_BASE}/api/cart/${userId}/clear`,
        { method: "DELETE" }
      );

      if (!clearRes.ok) throw new Error("Checkout failed");

      const data = await clearRes.json();

      alert(`Order placed! ${data.deleted} items removed`);

      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  });


  loadCart();
});