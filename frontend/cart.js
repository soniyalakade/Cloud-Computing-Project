document.addEventListener("DOMContentLoaded", () => {

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
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
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
    }
  }

  // ================= REMOVE ITEM =================
  function attachRemove() {
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", async () => {

        const productId = btn.dataset.id;

        await fetch(
          `http://localhost:5000/api/cart/${userId}/${productId}`,
          { method: "DELETE" }
        );

        loadCart();
        window.dispatchEvent(new Event("cartUpdated"));
      });
    });
  }

  // ================= CHECKOUT =================
  checkoutBtn.addEventListener("click", async () => {

    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const cart = await res.json();

      if (!Array.isArray(cart) || cart.length === 0) {
        alert("Cart is empty");
        return;
      }

      const clearRes = await fetch(
        `http://localhost:5000/api/cart/${userId}/clear`,
        { method: "DELETE" }
      );

      const data = await clearRes.json();

      alert(`Order placed! ${data.deleted} items removed`);

      await loadCart();

      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  });

  // INITIAL LOAD (ONLY ONCE)
  loadCart();

});