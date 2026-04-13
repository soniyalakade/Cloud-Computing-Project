document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("cost", document.getElementById("cost").value);
  formData.append("category", document.getElementById("category").value);
  formData.append("image", document.getElementById("image").files[0]);

  const res = await fetch("http://localhost:5000/api/add-product", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  alert(data.message);
});