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
async function loadProducts(page = 0) {

    try {

        const response =
            await fetchProducts(
                page,
                20,
                currentSortBy,
                currentSortDirection
            );

        renderProducts(response.content);

        renderPagination(
            response.number,
            response.totalPages
        );

        attachCartEvents();
        syncWishlistButtons();

    }

    catch (error) {

        console.error(
            "Failed to load products:",
            error
        );

        showToast(
            "❌ Backend not running.."
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

            cart[item.id] = {

                cartItemId: item.id,

                price: item.price,

                quantity: item.quantity,

                image: item.image,

                name: item.productName,
                originalPrice: item.originalPrice,

                discountPercent: item.discountPercent,

                flashSale: item.flashSale

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

    for (let cartItemId in cart) {

        const item =
            cart[cartItemId];

        const subtotal =
            item.price * item.quantity;

        count += item.quantity;
        total += subtotal;

        const isSale = Boolean(item.flashSale);
        const flashBadge = isSale
            ? `<span style="display:inline-block; font-size:11px; background:#ffe4e6; color:#e11d48; font-weight:700; padding:2px 6px; border-radius:4px; margin-left:6px; vertical-align:middle; border:1px solid #fecdd3;">⚡ Flash Sale (10% OFF)</span>`
            : "";

        const priceHTML = isSale && item.originalPrice != null
            ? `
                <del style="color:#9ca3af; font-size:13px; margin-right:6px;">
                    ₹${Number(item.originalPrice).toLocaleString("en-IN")}
                </del>
                <strong style="color:#e11d48; font-size:15px;">
                    ₹${Number(item.price).toLocaleString("en-IN")}
                </strong>
              `
            : `
                <strong style="font-size:15px;">
                    ₹${Number(item.price).toLocaleString("en-IN")}
                </strong>
              `;

        cartItems.innerHTML += `

        <li class="cart-item" style="${isSale ? "border-left: 3px solid #e11d48; padding-left: 8px;" : ""}">

            <div class="cart-item-content">

                <img
                    class="cart-item-image"
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-details">

                    <div style="display:flex; align-items:center; flex-wrap:wrap; margin-bottom:4px;">
                        <strong>${item.name}</strong>${flashBadge}
                    </div>

                    <div class="cart-item-price">
                        ${priceHTML}
                    </div>

                    <div class="cart-item-quantity">
                        Qty : ${item.quantity}
                    </div>

                    <div class="cart-item-subtotal">
                        ₹${Number(subtotal).toLocaleString("en-IN")}
                    </div>

                    <div class="cart-item-actions">

                        <button
                            onclick="changeQty(${cartItemId}, inc)"
                        >
                            +
                        </button>

                        <button
                            onclick="changeQty(${cartItemId}, dec)"
                        >
                            -
                        </button>

                        <button
                            onclick="removeItem(${cartItemId})"
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
        Number(total).toLocaleString("en-IN");

    document.getElementById("itemCount").textContent =
        count;

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }

    /*
     * Backend cart is the source of truth.
     * Do not save backend cart into localStorage.
     */

}
// ======================
// CHANGE QUANTITY
// ======================
// ======================

async function changeQty(cartItemId, action) {

    const item =
        cart[cartItemId];

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

    if (newQuantity <= 0) {
        await removeItem(cartItemId);
        return;
    }

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

        cart = {};

        cartData.items.forEach(item => {

            cart[item.id] = {

                cartItemId: item.id,

                price: item.price,

                quantity: item.quantity,

                image: item.image,

                name: item.productName,

                originalPrice: item.originalPrice,

                discountPercent: item.discountPercent,

                flashSale: item.flashSale

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
// ======================

async function removeItem(cartItemId) {

    const item =
        cart[cartItemId];

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

        cart = {};

        cartData.items.forEach(item => {

            cart[item.id] = {

                cartItemId: item.id,

                price: item.price,

                quantity: item.quantity,

                image: item.image,

                name: item.productName,

                originalPrice: item.originalPrice,

                discountPercent: item.discountPercent,

                flashSale: item.flashSale

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
// CHECKOUT
// ======================
// ======================

function buyNow() {

    const total =
        Number(
            document.getElementById("total").textContent
        );


    // ======================
    // EMPTY CART
    // ======================

    if (total === 0) {

        showToast(
            "🛒 Cart is Empty"
        );

        return;

    }


    // ======================
    // GO TO CHECKOUT
    // ======================

    window.location.href =
        "Checkout.html";

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

            cart[item.id] = {

                cartItemId: item.id,

                price: item.price,

                quantity: item.quantity,

                image: item.image,

                name: item.productName,

                originalPrice: item.originalPrice,

                discountPercent: item.discountPercent,

                flashSale: item.flashSale

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