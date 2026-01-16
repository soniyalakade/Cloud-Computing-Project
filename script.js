// Sample product data
const products = [
  {
    id: 1,
    name: "Red Dress",
    price: 3699,
    img: "data:image/jpeg;base64,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"
  },
  {
    id: 2,
    name: "Blue Jeans",
    price: 1999,
    img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQDBocOF4jDrYgnpdd_1pZohbZrn4dKH5e9I5XCSMd-jM-fz-s5aGPjNGPBT2zBSuUk33ZrjUXImF-DhalHdUTCU4z2qliI0Lgk9C8JyhsGnDcNnaSsemzU&usqp=CAc"
  },
  {
    id: 3,
    name: "Leather Jacket",
    price: 3999,
    img: "https://lh4.googleusercontent.com/proxy/Ion9ahy-DuW9RP5xSSErffmXnhnk8qHhIcr0sPHgY_ZH5-Q_vnIfH1z2pgjw-GsPw3LemzIHOSZw9e0hOE-N40TPcgZfdqbtCNgPWlzu3LIHmIbIcgLHY8iQ"
  },
  {
    id: 4,
    name: "Mens Sneakers",
    price: 1899,
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREqJyOHqEk8Hiyvru9edEsOOh69FPAXIIlyg&s"
  },
  {
    id: 5,
    name: "Handbag",
    price: 4999,
    img: "https://lh6.googleusercontent.com/proxy/8vUzR8OZURj5Fs4VjSPz8M0fkDnXkdQzWYh98OZCWjJhtqx4jIHdvV2Ekt5taphxf533FNpUxNlu70SRKtchwIgEY7qz1yKDr8M1UoaIqC6gwWucBdqsatH3wwTq4xTRnpygifq1_Q"
  }
];

// DOM
const productList = document.getElementById("product-list");

// Get cart from localStorage or initialize
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Render products
products.forEach((product) => {
  const productCard = document.createElement("div");
  productCard.className = "col-md-4 mb-4";

  productCard.innerHTML = `
  <div class="card h-100 shadow-sm">
    <div class="product-img-box">
      <img src="${product.img}" alt="${product.name}">
    </div>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">₹${product.price.toFixed(2)}</p>
      <button class="btn btn-primary mt-auto"
        onclick='addToCart(${JSON.stringify(product)})'>
        Add to Cart
      </button>
    </div>
  </div>
`;

  productList.appendChild(productCard);
});

// Add to cart
function addToCart(product) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    alert("Please login to add items to cart");
    window.location.href = "/auth/login.html";
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Item added to cart");
  updateCartCount();
}




// Update cart count
function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!cartCountEl) return;

  if (!isLoggedIn) {
    cartCountEl.innerText = "0";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCountEl.innerText = cart.length;
}


// Load cart count on page load
updateCartCount();
