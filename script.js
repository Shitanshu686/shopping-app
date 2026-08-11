let cart = {};

// ======================
// LOAD PRODUCTS
// ======================

async function loadProducts() {

    try {

        const products = await fetchProducts();

        renderProducts(products);

        attachCartEvents();



    }

    catch (error) {

        console.error(
            "Failed to load products:",
            error
        );

        showToast(
            "❌ Unable to load products"
        );

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
// CART DRAWER
// ======================

function openCart() {

    document.getElementById("cartPanel").style.right = "0";

}

function closeCart() {

    document.getElementById("cartPanel").style.right = "-420px";

}


// ======================
// START
// ======================

loadProducts();

