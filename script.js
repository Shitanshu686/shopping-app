let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || {};
// ======================
// LOAD PRODUCTS
// ======================
// ======================
// LOAD PENDING CART ITEM
// ======================

function loadPendingCartItem() {

    const pendingItem =
        localStorage.getItem("pendingCartItem");

    if (!pendingItem) {
        return;
    }

    const item =
        JSON.parse(pendingItem);

    if (cart[item.name]) {

        cart[item.name].quantity++;

    }
    else {

        cart[item.name] = {

            price: item.price,

            quantity: item.quantity

        };

    }

    localStorage.removeItem("pendingCartItem");

    updateCart();

    showToast(
        "✅ " + item.name + " added to cart"
    );
}
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
async function addToCart(
    productId,
    productName,
    productPrice,
    productImage
) {

    try {

        const cartData =
            await addProductToCart(
                productId,
                1
            );

        if (!cartData) {

            showToast(
                "❌ Unable to add product to cart"
            );

            return;

        }

        // ======================
        // UPDATE FRONTEND CART
        // ======================

        cart = {};

        cartData.items.forEach(item => {

            cart[item.productId] = {

                cartItemId: item.id,

                price: item.price,

                quantity: item.quantity,

                image: item.image,

                name: item.productName

            };

        });

        updateCart();

        showToast(
            "✅ " + productName + " added to cart"
        );

    }
    catch (error) {

        console.error(
            "Failed to add product to cart:",
            error
        );

        showToast(
            "❌ Unable to add product to cart"
        );

    }

}
// ======================
// UPDATE CART
// ======================

function updateCart() {

    const cartItems =
        document.getElementById("cartItems");

    cartItems.innerHTML = "";

    let total = 0;

    let count = 0;


    for (let productId in cart) {

        const item =
            cart[productId];


        const subtotal =
            item.price * item.quantity;


        count += item.quantity;

        total += subtotal;


        cartItems.innerHTML += `

        <li class="cart-item">

            <div class="cart-item-content">

                <img
                    class="cart-item-image"
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-details">

                    <strong>
                        ${item.name}
                    </strong>

                    <div class="cart-item-price">
                        ₹${item.price}
                    </div>

                    <div class="cart-item-quantity">
                        Qty : ${item.quantity}
                    </div>

                    <div class="cart-item-subtotal">
                        ₹${subtotal}
                    </div>

                    <div class="cart-item-actions">

                        <button
                            onclick="changeQty(${productId}, 'inc')"
                        >
                            +
                        </button>

                        <button
                            onclick="changeQty(${productId}, 'dec')"
                        >
                            -
                        </button>

                        <button
                            onclick="removeItem(${productId})"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            </div>

        </li>

        `;

    }


    document.getElementById("total").textContent =
        total;


    document.getElementById("itemCount").textContent =
        count;


    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent =
            count;

    }


    /*
     * Backend cart is now the source of truth.
     *
     * We intentionally do NOT save this cart
     * back into localStorage here.
     */
}
// ======================
// CHANGE QUANTITY
// ======================

async function changeQty(productId, action) {

    const item =
        cart[productId];

    if (!item) {
        return;
    }


    let newQuantity =
        item.quantity;


    if (action === "inc") {

        newQuantity++;

    }
    else if (action === "dec") {

        newQuantity--;

    }


    // ======================
    // REMOVE WHEN QUANTITY
    // BECOMES ZERO
    // ======================

    if (newQuantity <= 0) {

        await removeItem(productId);

        return;

    }


    // ======================
    // UPDATE BACKEND
    // ======================

    try {

        const cartData =
            await updateCartQuantity(
                item.cartItemId,
                newQuantity
            );


        if (!cartData) {

            showToast(
                "❌ Unable to update quantity"
            );

            return;

        }


        // ======================
        // SYNC FRONTEND CART
        // ======================

        cart = {};

        cartData.items.forEach(item => {

            cart[item.productId] = {

                cartItemId: item.id,

                price: item.price,

                quantity: item.quantity,

                image: item.image,

                name: item.productName

            };

        });


        updateCart();

    }
    catch (error) {

        console.error(
            "Failed to update cart quantity:",
            error
        );

        showToast(
            "❌ Unable to update quantity"
        );

    }

}
// ======================
// REMOVE PRODUCT
// ======================

async function removeItem(productId) {

    const item =
        cart[productId];

    if (!item) {
        return;
    }

    try {

        const cartData =
            await removeCartItem(
                item.cartItemId
            );

        if (!cartData) {

            showToast(
                "❌ Unable to remove product"
            );

            return;

        }

        // ======================
        // SYNC FRONTEND CART
        // ======================

        cart = {};

        cartData.items.forEach(item => {

            cart[item.productId] = {

                cartItemId: item.id,

                price: item.price,

                quantity: item.quantity,

                image: item.image,

                name: item.productName

            };

        });

        updateCart();

        showToast(
            "🗑 Product Removed"
        );

    }
    catch (error) {

        console.error(
            "Failed to remove cart item:",
            error
        );

        showToast(
            "❌ Unable to remove product"
        );

    }

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


// ======================
// LOAD BACKEND CART
// ======================

async function loadBackendCart() {

    const token =
        localStorage.getItem("token");

    // User logged in nahi hai
    if (!token) {
        return;
    }

    try {

        const cartData =
            await fetchCart();

        if (!cartData) {
            return;
        }

        cart = {};

        cartData.items.forEach(item => {

            cart[item.productId] = {

                cartItemId: item.id,

                price: item.price,

                quantity: item.quantity,

                image: item.image,

                name: item.productName

            };

        });

        updateCart();

    }
    catch (error) {

        console.error(
            "Failed to load backend cart:",
            error
        );

    }
}
loadProducts();
loadPendingCartItem();
loadBackendCart();