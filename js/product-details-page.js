// ======================
// PRODUCT DETAILS PAGE
// ======================

const params =
    new URLSearchParams(window.location.search);

const productId =
    params.get("id");

console.log("Product ID:", productId);


// ======================
// LOAD PRODUCT DETAILS
// ======================

async function loadProductDetails() {

    try {

        const response =
            await apiFetch(`/products/${productId}`);

        if (!response) {
            return;
        }

        const responseData =
            await response.json();

        const product =
            responseData.data;

        renderProductDetails(product);

        // ======================
        // LOAD REAL RATING
        // ======================

        loadProductAverageRating(product.rating);

    }
    catch (error) {

        console.error(
            "Failed to load product details:",
            error
        );

    }

}


// ======================
// RENDER PRODUCT DETAILS
// ======================

function renderProductDetails(product) {

    window.currentProduct = product;

    const container =
        document.getElementById("productDetails");

    container.innerHTML = `

        <div class="product-details__image-section">

            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-details__image"
            >

        </div>


        <div class="product-details__info">

            <p class="product-details__brand">
                ${product.brand}
            </p>


            <h1 class="product-details__title">
                ${product.name}
            </h1>


            <p class="product-details__description">
                ${product.description}
            </p>


            <!-- ======================
                 PRODUCT RATING
            ======================= -->

            <div
                id="productAverageRating"
                class="product-details__rating"
            >
                ⭐ ${product.rating}
            </div>


            <div class="product-details__price">
                ₹${product.price}
            </div>


            <p class="product-details__category">
                Category: ${product.category}
            </p>


            <p class="product-details__stock">
                Stock: ${product.stock}
            </p>


            <!-- ======================
                 ADD TO CART
            ======================= -->

            <button class="product-details__cart-btn">

                🛒 Add to Cart

            </button>


            <!-- ======================
                 PRODUCT SPECIFICATIONS
            ======================= -->

            <div class="product-details__specifications">

                <h2>
                    Product Specifications
                </h2>


                <div class="specification-row">

                    <span>
                        Product ID
                    </span>

                    <strong>
                        ${product.id}
                    </strong>

                </div>


                <div class="specification-row">

                    <span>
                        Brand
                    </span>

                    <strong>
                        ${product.brand}
                    </strong>

                </div>


                <div class="specification-row">

                    <span>
                        Category
                    </span>

                    <strong>
                        ${product.category}
                    </strong>

                </div>


                <div class="specification-row">

                    <span>
                        Rating
                    </span>

                    <strong
                        id="productSpecificationRating"
                    >
                        ⭐ ${product.rating}
                    </strong>

                </div>


                <div class="specification-row">

                    <span>
                        Available Stock
                    </span>

                    <strong>
                        ${product.stock}
                    </strong>

                </div>

            </div>


            <!-- ======================
                 TECHNICAL SPECIFICATIONS
            ======================= -->

            <div class="product-details__specifications">

                <h2>
                    Technical Specifications
                </h2>

                <div id="productSpecifications"></div>

            </div>

        </div>

    `;

}


// ======================
// LOAD PRODUCT AVERAGE RATING
// ======================

async function loadProductAverageRating(
    defaultRating
) {

    try {

        const response =
            await apiFetch(
                `/ratings/product/${productId}`
            );


        if (!response) {
            return;
        }


        const responseData =
            await response.json();


        const averageRating =
            responseData.data;


        // ======================
        // NO USER RATINGS
        // ======================

        if (
            averageRating === null ||
            averageRating === undefined
        ) {

            updateProductRating(
                defaultRating
            );

            return;
        }


        // ======================
        // REAL USER RATING
        // ======================

        updateProductRating(
            averageRating
        );

    }
    catch (error) {

        console.error(
            "Failed to load product average rating:",
            error
        );

    }

}


// ======================
// UPDATE PRODUCT RATING
// ======================

function updateProductRating(
    rating
) {

    const ratingElement =
        document.getElementById(
            "productAverageRating"
        );


    const specificationRating =
        document.getElementById(
            "productSpecificationRating"
        );


    if (ratingElement) {

        ratingElement.textContent =
            `⭐ ${Number(rating).toFixed(1)}`;

    }


    if (specificationRating) {

        specificationRating.textContent =
            `⭐ ${Number(rating).toFixed(1)}`;

    }

}


// ======================
// PRODUCT DETAILS TOAST
// ======================

function showProductDetailsToast(message) {

    const toast =
        document.getElementById(
            "productDetailsToast"
        );

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2000);

}


// ======================
// ADD TO CART
// ======================

document.addEventListener(
    "click",
    function (event) {

        const cartButton =
            event.target.closest(
                ".product-details__cart-btn"
            );

        if (!cartButton) {
            return;
        }


        const product =
            window.currentProduct;


        if (!product) {
            return;
        }


        const cartItem = {

            name: product.name,

            price: product.price,

            quantity: 1

        };


        localStorage.setItem(
            "pendingCartItem",
            JSON.stringify(cartItem)
        );


        showProductDetailsToast(
            "✅ " + product.name + " added to cart"
        );

    }
);


// ======================
// START
// ======================

loadProductDetails();