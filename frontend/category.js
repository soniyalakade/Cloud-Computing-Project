const params = new URLSearchParams(window.location.search);
const categoryType = (params.get("type") || "all").toLowerCase();

const title = document.getElementById("category-title");
const container = document.getElementById("category-products");

title.innerText = `${categoryType.toUpperCase()} Collection`;

async function loadProducts() {
  try {
    let url = `${API_BASE}/api/admin/products`;

    if (categoryType !== "all") {
      url = `${API_BASE}/api/category/${categoryType}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const products = await res.json();
    container.innerHTML = "";

    if (!products || products.length === 0) {
      container.innerHTML = `
        <div class="text-center text-muted">
          No products found in this category
        </div>`;
      return;
    }

    products.forEach(product => {
      const col = document.createElement("div");
      col.className = "col-md-4 col-sm-6";

      col.innerHTML = `
        <div class="card h-100 shadow-sm border-0 product-card">

          <img src="${product.imageUrl}" 
               class="card-img-top p-3"
               style="height:250px; object-fit:contain;"
               alt="${product.name}">

          <div class="card-body d-flex flex-column text-center">

            <h5 class="fw-semibold">${product.name}</h5>

            <p class="text-success fw-bold fs-5">₹${product.cost}</p>

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
    container.innerHTML = `
      <div class="text-danger text-center">
        Error loading products
      </div>`;
  }
}

// ================= ADD TO CART =================
async function addToCart(product) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Please login first");
    window.location.href = "../auth/login.html";
    return;
  }

  const payload = {
    userId,
    productId: product._id,
    name: product.name,
    price: Number(product.cost),
    image: product.imageUrl,
    quantity: 1   // 🔥 REQUIRED for DynamoDB model
  };

  try {
    const res = await fetch(`${API_BASE}/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("Backend response:", data);
      throw new Error("Failed to add to cart");
    }

    alert("Added to cart successfully!");
    window.dispatchEvent(new Event("cartUpdated"));

  } catch (err) {
    console.error(err);
    alert("Error adding to cart");
  }
}

loadProducts();