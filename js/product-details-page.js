// ======================
// PRODUCT DETAILS PAGE
// ======================

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("Product ID:", productId);

// ======================
// LOAD PRODUCT DETAILS
// ======================

async function loadProductDetails() {
    try {
        const response = await apiFetch(`/products/${productId}`);
        if (!response) return;

        const responseData = await response.json();
        const product = responseData.data;

        renderProductDetails(product);
        loadProductAverageRating(product.rating);
    } catch (error) {
        console.error("Failed to load product details:", error);
    }
}

// ======================
// RENDER PRODUCT DETAILS
// ======================

function renderProductDetails(product) {
    window.currentProduct = product;

    // Collect images array or fallback to single image
    const images = (product.images && Array.isArray(product.images) && product.images.length > 0)
        ? product.images
        : [product.image || "images/placeholder.png"];

    const primaryImage = images[0];
    const container = document.getElementById("productDetails");

    container.innerHTML = `
        <!-- E-COMMERCE IMAGE GALLERY -->
        <div class="product-gallery">
            <!-- Thumbnail Strip -->
            <div class="product-gallery__thumbnails" id="galleryThumbnails">
                ${images.map((imgUrl, index) => `
                    <div class="product-gallery__thumb ${index === 0 ? 'active' : ''}" data-src="${imgUrl}">
                        <img src="${imgUrl}" alt="${product.name} thumbnail${index + 1}" onerror="this.src='images/placeholder.png'">
                    </div>
                `).join('')}
            </div>

            <!-- Main Stage with Inner Smooth Zoom -->
            <div class="product-gallery__stage" id="galleryStage">
                <img id="activeGalleryImage" src="${primaryImage}" alt="${product.name}" class="product-gallery__main-img" onerror="this.src='images/placeholder.png'">
                
                <button type="button" class="product-gallery__expand-btn" id="expandLightboxBtn" title="Enlarge image">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- PRODUCT DETAILS INFO -->
        <div class="product-details__info">
            <p class="product-details__brand">${product.brand || 'ShopEase'}</p>
            <h1 class="product-details__title">${product.name}</h1>
            <p class="product-details__description">${product.description || ''}</p>

            <div id="productAverageRating" class="product-details__rating">
                ⭐ ${product.rating || '0.0'}
            </div>

            <div class="product-details__price">₹${product.price}</div>
            <p class="product-details__category">Category: ${product.category || 'General'}</p>
            <p class="product-details__stock">Stock: ${product.stock !== undefined ? product.stock : 'Available'}</p>

            <button class="product-details__cart-btn">🛒 Add to Cart</button>

            <!-- PRODUCT SPECIFICATIONS -->
            <div class="product-details__specifications">
                <h2>Product Specifications</h2>
                <div class="specification-row">
                    <span>Product ID</span>
                    <strong>${product.id}</strong>
                </div>
                <div class="specification-row">
                    <span>Brand</span>
                    <strong>${product.brand || 'ShopEase'}</strong>
                </div>
                <div class="specification-row">
                    <span>Category</span>
                    <strong>${product.category || 'General'}</strong>
                </div>
                <div class="specification-row">
                    <span>Rating</span>
                    <strong id="productSpecificationRating">⭐ ${product.rating || '0.0'}</strong>
                </div>
                <div class="specification-row">
                    <span>Available Stock</span>
                    <strong>${product.stock !== undefined ? product.stock : 'In Stock'}</strong>
                </div>
            </div>

            <!-- TECHNICAL SPECIFICATIONS -->
            <div class="product-details__specifications">
                <h2>Technical Specifications</h2>
                <div id="productSpecifications"></div>
            </div>
        </div>

        <!-- FULL-SCREEN LIGHTBOX MODAL -->
        <div class="product-gallery__lightbox" id="galleryLightbox">
            <span class="product-gallery__lightbox-close" id="closeLightboxBtn">&times;</span>
            <img class="product-gallery__lightbox-img" id="lightboxActiveImg" src="${primaryImage}" alt="${product.name}">
        </div>
    `;

    // Initialize Gallery Event Listeners
    initGalleryInteractions();
}

// ======================
// GALLERY INTERACTIONS (Thumbnails, Inner Zoom, Lightbox)
// ======================

function initGalleryInteractions() {
    const stage = document.getElementById("galleryStage");
    const activeImg = document.getElementById("activeGalleryImage");
    const thumbs = document.querySelectorAll(".product-gallery__thumb");
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImg = document.getElementById("lightboxActiveImg");
    const expandBtn = document.getElementById("expandLightboxBtn");
    const closeLightboxBtn = document.getElementById("closeLightboxBtn");

    if (!stage || !activeImg) return;

    // 1. Thumbnail Switching
    thumbs.forEach(thumb => {
        thumb.addEventListener("click", () => {
            thumbs.forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");

            const newSrc = thumb.getAttribute("data-src");
            activeImg.style.opacity = "0.2";
            setTimeout(() => {
                activeImg.src = newSrc;
                lightboxImg.src = newSrc;
                activeImg.style.opacity = "1";
            }, 120);
        });
    });

    // 2. Modern Inner Zoom (Box ke andar hi zoom hoga, text kabhi cover nahi hoga)
    stage.addEventListener("mousemove", (e) => {
        const rect = stage.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        activeImg.style.transformOrigin = `${x}% ${y}%`;
        activeImg.style.transform = "scale(2.2)";
    });

    stage.addEventListener("mouseleave", () => {
        activeImg.style.transformOrigin = "center center";
        activeImg.style.transform = "scale(1)";
    });

    // 3. Lightbox Controls
    const openLightbox = () => {
        lightboxImg.src = activeImg.src;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = "auto";
    };

    if (expandBtn) expandBtn.addEventListener("click", openLightbox);
    if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });
}

// ======================
// LOAD PRODUCT AVERAGE RATING
// ======================

async function loadProductAverageRating(defaultRating) {
    try {
        const response = await apiFetch(`/ratings/product/${productId}`);
        if (!response) return;

        const responseData = await response.json();
        const averageRating = responseData.data;

        if (averageRating === null || averageRating === undefined) {
            updateProductRating(defaultRating);
            return;
        }

        updateProductRating(averageRating);
    } catch (error) {
        console.error("Failed to load product average rating:", error);
    }
}

// ======================
// UPDATE PRODUCT RATING
// ======================

function updateProductRating(rating) {
    const ratingElement = document.getElementById("productAverageRating");
    const specificationRating = document.getElementById("productSpecificationRating");

    if (ratingElement) {
        ratingElement.textContent = `⭐ ${Number(rating).toFixed(1)}`;
    }
    if (specificationRating) {
        specificationRating.textContent = `⭐ ${Number(rating).toFixed(1)}`;
    }
}

// ======================
// PRODUCT DETAILS TOAST
// ======================

function showProductDetailsToast(message) {
    const toast = document.getElementById("productDetailsToast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

// ======================
// ADD TO CART
// ======================

document.addEventListener("click", (event) => {
    const cartButton = event.target.closest(".product-details__cart-btn");
    if (!cartButton) return;

    const product = window.currentProduct;
    if (!product) return;

    const cartItem = {
        name: product.name,
        price: product.price,
        quantity: 1
    };

    localStorage.setItem("pendingCartItem", JSON.stringify(cartItem));
    showProductDetailsToast("✅ " + product.name + " added to cart");
});

// ======================
// START
// ======================

loadProductDetails();
