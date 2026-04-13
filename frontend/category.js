const API_BASE = "http://fashion-store-alb-769926527.eu-west-3.elb.amazonaws.com";

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
    const products = await res.json();

    container.innerHTML = "";

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

      col.querySelector(".add-cart-btn").addEventListener("click", () => addToCart(product));
    });

  } catch (error) {
    console.error(error);
  }
}

async function addToCart(product) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("Login first");
    return;
  }

  await fetch(`${API_BASE}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      productId: product._id,
      name: product.name,
      price: product.cost,
      image: product.imageUrl
    })
  });

  alert("Added to cart");
}

loadProducts();