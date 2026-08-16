// ======================
// WISHLIST STATE
// ======================

let wishlist = [];


// ======================
// LOAD WISHLIST
// ======================

async function loadWishlist() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        wishlist = [];

        updateWishlistCount();

        renderWishlist();

        return;

    }

    try {

        const response =
            await apiFetch("/wishlist");

        if (!response) {
            return;
        }

        const responseData =
            await response.json();

        if (!responseData.success) {

            console.error(
                "Wishlist API Error:",
                responseData.message
            );

            return;
        }

        wishlist =
            responseData.data.items || [];

        updateWishlistCount();

        renderWishlist();

        syncWishlistButtons();

    }

    catch (error) {

        console.error(
            "Failed to load wishlist:",
            error
        );

    }

}


// ======================
// ADD TO WISHLIST
// ======================

async function addProductToWishlist(productId) {

    const response =
        await apiFetch(
            `/wishlist/${productId}`,
            {
                method: "POST"
            }
        );

    if (!response) {
        return null;
    }

    return await response.json();

}


// ======================
// TOGGLE WISHLIST
// ======================

async function toggleWishlist(
    productId,
    button
) {

    try {

        const existingItem =
            wishlist.find(
                item =>
                    Number(item.productId) ===
                    Number(productId)
            );


        // ======================
        // REMOVE
        // ======================

        if (existingItem) {

            await removeFromWishlist(
                existingItem.id
            );

            return;

        }


        // ======================
        // ADD
        // ======================

        const response =
            await addProductToWishlist(
                productId
            );

        if (!response) {

            showToast(
                "❌ Unable to update wishlist"
            );

            return;

        }

        if (response.success) {

            wishlist =
                response.data.items || [];

            updateWishlistCount();

            renderWishlist();

            syncWishlistButtons();

            showToast(
                "❤️ Added to Wishlist"
            );

            return;

        }

        showToast(
            "❌ " + response.message
        );

    }

    catch (error) {

        console.error(
            "Wishlist error:",
            error
        );

        showToast(
            "❌ Unable to update wishlist"
        );

    }

}


// ======================
// RENDER WISHLIST
// ======================

function renderWishlist() {

    const container =
        document.getElementById("wishlistItems");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    // ======================
    // EMPTY WISHLIST
    // ======================

    if (wishlist.length === 0) {

        container.innerHTML = `

            <div style="
                min-height:300px;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                text-align:center;
                padding:20px;
                box-sizing:border-box;
            ">

                <div style="
                    font-size:50px;
                    opacity:0.3;
                    margin-bottom:10px;
                ">
                    🤍
                </div>

                <h3 style="
                    margin:0 0 8px 0;
                    font-size:18px;
                    color:#555;
                ">
                    Your Wishlist is Empty
                </h3>

                <p style="
                    margin:0;
                    font-size:14px;
                    color:#888;
                ">
                    Save products you love and
                    find them here later.
                </p>

            </div>

        `;

        return;
    }


    // ======================
    // RENDER ITEMS
    // ======================

    wishlist.forEach(item => {

        container.innerHTML += `

            <div
                class="wishlist-item"
                style="
                    display:flex !important;
                    flex-direction:row !important;
                    align-items:center !important;
                    gap:15px !important;
                    width:100% !important;
                    min-height:100px !important;
                    padding:10px !important;
                    margin:0 0 12px 0 !important;
                    box-sizing:border-box !important;
                    background:#ffffff !important;
                    border:1px solid #e5e7eb !important;
                    border-radius:10px !important;
                    box-shadow:0 2px 8px rgba(0,0,0,0.08) !important;
                "
            >

                <!-- PRODUCT IMAGE -->

                <img
                    class="wishlist-item-image"
                    src="${item.image}"
                    alt="${item.productName}"
                    style="
                        display:block !important;
                        width:80px !important;
                        height:80px !important;
                        min-width:80px !important;
                        max-width:80px !important;
                        min-height:80px !important;
                        max-height:80px !important;
                        flex:0 0 80px !important;
                        object-fit:contain !important;
                        object-position:center !important;
                        padding:4px !important;
                        margin:0 !important;
                        box-sizing:border-box !important;
                        background:#f7f7f7 !important;
                        border:1px solid #eeeeee !important;
                        border-radius:8px !important;
                    "
                >

                <!-- PRODUCT DETAILS -->

                <div
                    class="wishlist-item-details"
                    style="
                        display:flex !important;
                        flex-direction:column !important;
                        align-items:flex-start !important;
                        justify-content:center !important;
                        flex:1 1 auto !important;
                        min-width:0 !important;
                        gap:6px !important;
                        margin:0 !important;
                        padding:0 !important;
                        box-sizing:border-box !important;
                    "
                >

                    <h3 style="
                        width:100% !important;
                        margin:0 !important;
                        padding:0 !important;
                        font-size:15px !important;
                        line-height:1.3 !important;
                        font-weight:600 !important;
                        color:#222222 !important;
                    ">
                        ${item.productName}
                    </h3>

                    <p
                        class="wishlist-item-price"
                        style="
                            margin:0 !important;
                            padding:0 !important;
                            font-size:15px !important;
                            line-height:1.3 !important;
                            font-weight:700 !important;
                            color:#2874f0 !important;
                        "
                    >
                        ₹${item.price}
                    </p>

                    <button
                        class="wishlist-remove-btn"
                        onclick="removeFromWishlist(${item.id})"
                        style="
                            display:inline-flex !important;
                            align-items:center !important;
                            justify-content:center !important;
                            width:auto !important;
                            min-width:0 !important;
                            height:30px !important;
                            padding:5px 10px !important;
                            margin:0 !important;
                            border:1px solid #ef9a9a !important;
                            border-radius:6px !important;
                            background:#fff5f5 !important;
                            color:#d32f2f !important;
                            font-family:Arial,sans-serif !important;
                            font-size:12px !important;
                            font-weight:600 !important;
                            line-height:18px !important;
                            cursor:pointer !important;
                            box-shadow:none !important;
                        "
                    >
                        🗑 Remove
                    </button>

                </div>

            </div>

        `;

    });

}
// ======================
// UPDATE COUNT
// ======================

function updateWishlistCount() {

    const count =
        document.getElementById(
            "wishlistCount"
        );

    if (count) {

        count.textContent =
            wishlist.length;

    }

}


// ======================
// SYNC PRODUCT BUTTONS
// ======================

function syncWishlistButtons() {

    document
        .querySelectorAll(".wishlist-btn")
        .forEach(button => {

            const productId =
                Number(
                    button.dataset.productId
                );

            const exists =
                wishlist.some(
                    item =>
                        Number(item.productId) ===
                        productId
                );

            if (exists) {

                button.textContent = "❤️";

                button.classList.add("active");

            }
            else {

                button.textContent = "🤍";

                button.classList.remove("active");

            }

        });

}


// ======================
// REMOVE WISHLIST ITEM
// ======================

async function removeFromWishlist(itemId) {

    try {

        const response =
            await apiFetch(
                `/wishlist/${itemId}`,
                {
                    method: "DELETE"
                }
            );

        if (!response) {
            return;
        }

        const responseData =
            await response.json();

        if (!responseData.success) {

            showToast(
                "❌ " + responseData.message
            );

            return;

        }

        wishlist =
            responseData.data.items || [];

        updateWishlistCount();

        renderWishlist();

        syncWishlistButtons();

        showToast(
            "🗑 Product removed from wishlist"
        );

    }

    catch (error) {

        console.error(
            "Remove wishlist error:",
            error
        );

        showToast(
            "❌ Unable to remove product"
        );

    }

}


// ======================
// OPEN WISHLIST
// ======================

async function openWishlist() {

    const panel =
        document.getElementById(
            "wishlistPanel"
        );

    if (!panel) {

        console.error(
            "wishlistPanel not found"
        );

        return;

    }


    // Force drawer position
    panel.style.position = "fixed";

    panel.style.top = "0";

    panel.style.right = "0";

    panel.style.bottom = "0";

    panel.style.width = "400px";

    panel.style.height = "100vh";

    panel.style.background = "#ffffff";

    panel.style.zIndex = "999999";

    panel.style.display = "block";

    panel.style.visibility = "visible";

    panel.style.opacity = "1";

    panel.style.overflowY = "auto";


    await loadWishlist();

}


// ======================
// CLOSE WISHLIST
// ======================

function closeWishlist() {

    const panel =
        document.getElementById(
            "wishlistPanel"
        );

    if (!panel) {
        return;
    }

    panel.style.right = "-420px";

}


// ======================
// INITIALIZE
// ======================

function initializeWishlist() {

    loadWishlist();

}