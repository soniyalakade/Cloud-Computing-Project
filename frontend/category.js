const params = new URLSearchParams(window.location.search);
const categoryType = (params.get("type") || "all").toLowerCase();

document.getElementById("category-title").innerText =
  categoryType + " Collection";

const container = document.getElementById("category-products");

async function loadProducts() {
  try {
    let url = `${API_BASE}/api/admin/products`;

    if (categoryType !== "all") {
      url = `${API_BASE}/api/category/${categoryType}`;
    }

    const res = await fetch(url);

    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);

    const products = await res.json();

    container.innerHTML = "";

    if (!Array.isArray(products) || products.length === 0) {
      container.innerHTML = "<p>No products found</p>";
      return;
    }

    products.forEach(product => {

      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      col.innerHTML = `
        <div class="card h-100 shadow">
          <img src="${product.imageUrl}" class="card-img-top">
          <div class="card-body d-flex flex-column">
            <h5>${product.name}</h5>
            <p>₹${product.cost}</p>

            <button class="btn btn-primary mt-auto w-100 add-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      `;

      container.appendChild(col);

      col.querySelector(".add-cart-btn").addEventListener("click", () => {
        addToCart(product);
      });

    });

  } catch (error) {
    console.error("Load products error:", error);
    container.innerHTML = "<p>Error loading products</p>";
  }
}


// ================= ADD TO CART =================
async function addToCart(product) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Login first");
    window.location.href = "./auth/login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productId: product.id,   // ✅ FIXED
        name: product.name,
        price: product.cost,
        image: product.imageUrl
      })
    });

    if (!res.ok) throw new Error("Failed to add to cart");

    alert("Added to cart");

    window.dispatchEvent(new Event("cartUpdated")); // ✅ FIXED

  } catch (err) {
    console.error(err);
    alert("Error adding to cart");
  }
}

loadProducts();