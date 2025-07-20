// ========== script.js ==========
document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Product 1", price: 29.99 },
    { id: 2, name: "Product 2", price: 19.99 },
    { id: 3, name: "Product 3", price: 59.99 }
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartTotalMessage = document.getElementById("cart-total");
  const totalPriceDisplay = document.getElementById("total-price");
  const checkOutBtn = document.getElementById("checkout-btn");
  const addProductForm = document.getElementById("add-product-form");
  const productNameInput = document.getElementById("product-name");
  const productPriceInput = document.getElementById("product-price");
  const themeToggle = document.getElementById("theme-toggle");

  function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function renderProducts() {
    productList.innerHTML = "";
    products.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <span><i class="fa-solid fa-box"></i> ${product.name}</span>
        <span>$${product.price.toFixed(2)}</span>
        <button class="add-btn" data-id="${product.id}">
          <i class="fa-solid fa-cart-plus"></i>
        </button>
      `;
      productList.appendChild(productDiv);
    });
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCartToLocalStorage();
    renderCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToLocalStorage();
    renderCart();
  }

  function renderCart() {
    cartItems.innerHTML = "";
    let totalPrice = 0;

    if (cart.length > 0) {
      emptyCartMessage.classList.add("hidden");
      cartTotalMessage.classList.remove("hidden");

      cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        const cartItem = document.createElement("div");
        cartItem.classList.add("product");
        cartItem.innerHTML = `
          <span><i class="fa-solid fa-tag"></i> ${item.name} x${item.quantity}</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="remove-btn" data-index="${index}">
            <i class="fa-solid fa-trash"></i>
          </button>
        `;
        cartItems.appendChild(cartItem);
      });

      totalPriceDisplay.textContent = totalPrice.toFixed(2);
    } else {
      emptyCartMessage.classList.remove("hidden");
      cartTotalMessage.classList.add("hidden");
      totalPriceDisplay.textContent = "0.00";
    }
  }

  productList.addEventListener("click", (e) => {
    if (e.target.closest(".add-btn")) {
      const button = e.target.closest(".add-btn");
      const productId = parseInt(button.getAttribute("data-id"));
      const product = products.find(p => p.id === productId);
      addToCart(product);
    }
  });

  cartItems.addEventListener("click", (e) => {
    if (e.target.closest(".remove-btn")) {
      const index = parseInt(e.target.closest(".remove-btn").getAttribute("data-index"));
      removeFromCart(index);
    }
  });

  checkOutBtn.addEventListener("click", () => {
    cart = [];
    saveCartToLocalStorage();
    alert("Checkout successful!");
    renderCart();
  });

  addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);

    if (name && price > 0) {
      const newProduct = {
        id: Date.now(),
        name,
        price,
      };
      products.push(newProduct);
      renderProducts();
      productNameInput.value = "";
      productPriceInput.value = "";
    }
  });

  function updateThemeIcon() {
    themeToggle.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
  }

  // Load theme from localStorage
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
  }
  updateThemeIcon();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("theme", mode);
    updateThemeIcon();
  });

  renderProducts();
  renderCart();
});
