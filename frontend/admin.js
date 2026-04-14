async function loadProducts() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/products`);

    if (!res.ok) throw new Error("Failed to load products");

    const products = await res.json();

    const container = document.getElementById("productList");
    container.innerHTML = "";

    products.forEach(product => {
      container.innerHTML += `
        <div class="card">
          <img src="${product.imageUrl}" width="120" />

          <h3>${product.name}</h3>
          <p>₹${product.cost}</p>
          <p>${product.category}</p>

          <button onclick="deleteProduct('${product.id}')">
            Delete
          </button>
        </div>
      `;
    });

  } catch (err) {
    console.error("Load products error:", err);
  }
}


// ================= DELETE =================
async function deleteProduct(id) {
  try {
    await fetch(`${API_BASE}/api/product/${id}`, {
      method: "DELETE"
    });

    loadProducts();
  } catch (err) {
    console.error("Delete error:", err);
  }
}


// ================= ADD PRODUCT =================
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("cost", document.getElementById("cost").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("image", document.getElementById("image").files[0]);

  try {
    const res = await fetch(`${API_BASE}/api/add-product`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    alert(data.message);

    loadProducts();

  } catch (err) {
    console.error("Add product error:", err);
    alert("Failed to add product");
  }
});


// INIT
loadProducts();