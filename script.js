let cart = {};

// ======================
// LOAD PRODUCTS
// ======================

async function loadProducts() {

    try {

        const response = await fetch("http://localhost:8080/products");

        const products = await response.json();

        const productDiv = document.getElementById("products");

        productDiv.innerHTML = "";

        products.forEach(product => {

            productDiv.innerHTML += `

            <div class="card">

                <img src="${product.image}" alt="${product.name}">

                <p class="brand">${product.brand}</p>

<h3>${product.name}</h3>

<p class="description">${product.description}</p>

<p class="price">₹${product.price}</p>

            <button
    class="add-cart-btn"
    data-name="${product.name}"
    data-price="${product.price}">

                    🛒 Add to Cart

                </button>

            </div>

            `;

        });
        document.querySelectorAll(".add-cart-btn").forEach(button => {

            button.addEventListener("click", function () {

                const productName = this.dataset.name;
                const productPrice = Number(this.dataset.price);

                addToCart(productName, productPrice);

            });

        });

    }

    catch (error) {

        console.error(error);

        showToast("❌ Backend Not Running");

    }

}

// ======================
// ADD TO CART
// ======================

function addToCart(product, price) {

    if (cart[product]) {

        if (cart[product].quantity >= 5) {

            showToast("⚠ Maximum 5 items allowed");

            return;

        }

        cart[product].quantity++;

    }

    else {

        cart[product] = {

            price: price,

            quantity: 1

        };

    }

    updateCart();

    showToast("✅ " + product + " added to cart");

}

// ======================
// UPDATE CART
// ======================

function updateCart() {

    let cartItems = document.getElementById("cartItems");

    cartItems.innerHTML = "";

    let total = 0;

    let count = 0;

    for (let product in cart) {

        let item = cart[product];

        count += item.quantity;

        total += item.price * item.quantity;

        cartItems.innerHTML += `

        <li>

            <strong>${product}</strong>

            <br>

            Qty : ${item.quantity}

            <br>

            ₹${item.price * item.quantity}

            <br><br>

            <button onclick="changeQty('${product}','inc')">+</button>

            <button onclick="changeQty('${product}','dec')">-</button>

            <button onclick="removeItem('${product}')">

                Remove

            </button>

        </li>

        <hr>

        `;

    }

    document.getElementById("total").textContent = total;

    document.getElementById("itemCount").textContent = count;

    let cartCount = document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent = count;

    }

}

// ======================
// CHANGE QUANTITY
// ======================

function changeQty(product, action) {

    if (action === "inc") {

        if (cart[product].quantity < 5)

            cart[product].quantity++;

    }

    else {

        cart[product].quantity--;

        if (cart[product].quantity <= 0) {

            delete cart[product];

        }

    }

    updateCart();

}

// ======================
// REMOVE PRODUCT
// ======================

function removeItem(product) {

    delete cart[product];

    updateCart();

    showToast("🗑 Product Removed");

}

// ======================
// BUY NOW
// ======================

function buyNow() {

    let total = document.getElementById("total").textContent;

    if (total == 0) {

        showToast("🛒 Cart is Empty");

        return;

    }

    showToast("🎉 Order Placed Successfully");

    cart = {};

    updateCart();

    closeCart();

}

// ======================
// SEARCH
// ======================

function searchProduct(value) {

    value = value.toLowerCase();

    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        let name = card.querySelector("h3").textContent.toLowerCase();

        if (name.includes(value)) {

            card.style.display = "block";

        }

        else {

            card.style.display = "none";

        }

    });

}

// ======================
// CART DRAWER
// ======================

function openCart() {

    document.getElementById("cartPanel").style.right = "0";

}

function closeCart() {

    document.getElementById("cartPanel").style.right = "-420px";

}

// ======================
// TOAST
// ======================

function showToast(message) {

    let toast = document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);

}

// ======================
// START
// ======================

loadProducts();