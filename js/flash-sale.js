/* =========================================================
   SHOP EASE - FLASH SALE
   Uses REAL product data from backend
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    const productsContainer =
        document.getElementById("flashSaleProducts");

    if (!productsContainer) {
        return;
    }

    try {

        /* Fetch real products from backend */
        const response = await fetchProducts(0, 100);

        const products = response?.content || [];

        /*
         * No fake products.
         * Only products that actually exist and have stock.
         */
        const availableProducts = products
            .filter(product => product.stock > 0)
            .map(product => {
                const currentPrice = Number(product.price);
                const flashPrice = Math.round(currentPrice * 0.90);

                return {
                    ...product,
                    flashPrice,
                    discount: 10
                };
            })
            .slice(0, 6);

        renderFlashSale(availableProducts);

    } catch (error) {

        console.error(
            "Flash Sale Error:",
            error
        );

        productsContainer.innerHTML =
            "<p>Unable to load Flash Sale products.</p>";
    }


    /* =========================
       RENDER PRODUCTS
    ========================= */

    function renderFlashSale(products) {

        productsContainer.innerHTML = "";

        if (products.length === 0) {

            productsContainer.innerHTML =
                "<p>No discounted products available right now.</p>";

            return;
        }

        products.forEach(product => {

            const image = product.image.startsWith("/uploads/")
                ? "http://localhost:8080" + product.image
                : product.image;

            const card = document.createElement("article");

            card.className = "flash-product-card";

            card.innerHTML = `
                <span class="flash-discount">
                    -${product.discount}%
                </span>

                <div class="flash-product-image">
                    <img
                        src="${image}"
                        alt="${product.name}"
                    >
                </div>

                <div class="flash-product-info">

                    <h3>${product.name}</h3>

                    <div class="flash-rating">
                        ⭐ ${product.rating}
                    </div>

                    <div class="flash-price">
                        <strong>
                            ₹${product.flashPrice.toLocaleString("en-IN")}
                        </strong>

                        <del>
                            ₹${Number(product.price).toLocaleString("en-IN")}
                        </del>
                    </div>

                    <div class="flash-stock">

                        <span>
                            ${
                                product.stock <= 10
                                    ? `Only ${product.stock} Left`
                                    : `${product.stock} In Stock`
                            }
                        </span>

                        <div class="stock-bar">
                            <div
                                style="width: ${Math.min(product.stock, 100)}%"
                            ></div>
                        </div>

                    </div>

                    <button
                        class="flash-add-cart"
                        data-product-id="${product.id}"
                    >
                        🛒 Add to Cart
                    </button>

                </div>
            `;

            productsContainer.appendChild(card);
        });

        attachCartButtons();
    }


    /* =========================
       ADD TO CART
    ========================= */

    function attachCartButtons() {

        const buttons =
            document.querySelectorAll(".flash-add-cart");

        buttons.forEach(button => {

            button.addEventListener("click", async () => {

                const productId =
                    Number(button.dataset.productId);

                const result =
                    await addProductToCart(productId, 1, true);

                if (result) {
                    await loadBackendCart();

                    button.textContent = "Added ✓";

                    setTimeout(() => {
                        button.textContent = "🛒 Add to Cart";
                    }, 1500);

                }

            });

        });
    }


    /* =========================
       COUNTDOWN
    ========================= */

    try {
        const flashSaleResponse = await fetch("http://localhost:8080/flash-sale");
        const flashSale = await flashSaleResponse.json();

        if (flashSale.active) {

            const endTime = new Date(flashSale.endTime).getTime();

            function updateFlashTimer() {

                const remaining = endTime - Date.now();

                if (remaining <= 0) {
                    document.getElementById("flash-hours").textContent = "00";
                    document.getElementById("flash-minutes").textContent = "00";
                    document.getElementById("flash-seconds").textContent = "00";
                    return;
                }

                const totalSeconds = Math.floor(remaining / 1000);

                const hours = Math.floor(totalSeconds / 3600);

                const minutes = Math.floor(
                    (totalSeconds % 3600) / 60
                );

                const seconds = totalSeconds % 60;

                document.getElementById("flash-hours").textContent =
                    String(hours).padStart(2, "0");

                document.getElementById("flash-minutes").textContent =
                    String(minutes).padStart(2, "0");

                document.getElementById("flash-seconds").textContent =
                    String(seconds).padStart(2, "0");
            }

            updateFlashTimer();

            setInterval(updateFlashTimer, 1000);
        }

    } catch (error) {
        console.error("Flash Sale Timer Error:", error);
    }


    
});

