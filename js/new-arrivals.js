/* =========================================================
   SHOP EASE - DYNAMIC REAL NEW ARRIVALS
   Picks latest products added to the catalog with full image resolution.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("newArrivalsContainer");
    if (!container) return;

    try {
        // 1. Fetch products from backend
        const productRes = await fetchProducts(0, 100);
        const allProducts = productRes?.content || [];

        if (!allProducts.length) {
            renderEmpty("No new arrivals available right now.");
            return;
        }

        // 2. Filter available stock and sort by newest
        const newArrivals = allProducts
            .filter(p => Number(p.stock) > 0)
            .sort((a, b) => {
                if (a.createdAt && b.createdAt) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return Number(b.id) - Number(a.id);
            })
            .slice(0, 8);

        if (!newArrivals.length) {
            renderEmpty("Check back soon for new additions to the catalog!");
            return;
        }

        // 3. Render New Arrival cards
        renderCards(newArrivals);

    } catch (err) {
        console.error("New Arrivals Error:", err);
        renderEmpty("Unable to load new arrivals at this time.");
    }

    function resolveProductImage(rawImage) {
        if (!rawImage) return "images/placeholder.png";
        if (typeof rawImage === "string" && rawImage.startsWith("/uploads/")) {
            return "http://localhost:8080" + rawImage;
        }
        return rawImage;
    }

    function renderEmpty(message) {
        container.innerHTML = `
            <div class="new-arrivals-empty-state">
                <span>✨</span>
                <h3>No New Arrivals</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function renderCards(products) {
        container.innerHTML = products.map(product => {
            const rawImg = product.image || product.imageUrl;
            const imgSrc = resolveProductImage(rawImg);
            const categoryName = product.category?.name || product.category || "Catalog";

            return `
                <div class="new-arrival-card">
                    <div class="new-arrival-img-wrapper">
                        <span class="new-arrival-pill">✨ Just In</span>
                        <img src="${imgSrc}" alt="${product.name}" onerror="this.onerror=null;this.src='images/placeholder.png';">
                    </div>
                    <div class="new-arrival-info">
                        <span class="new-arrival-category">${categoryName}</span>
                        <h4>${product.name}</h4>
                        <div class="new-arrival-bottom">
                            <span class="new-arrival-price">₹${product.price}</span>
                            <button class="new-arrival-btn" onclick="viewProductDetails ? viewProductDetails(${product.id}) : window.location.href='ProductDetails.html?id=${product.id}'">View</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }
});
