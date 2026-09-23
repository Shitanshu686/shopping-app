/* =========================================================
   SHOP EASE - 100% REAL BROWSING HISTORY TRACKER
   - Robust single-price parser (no double-price concatenation)
   - Proper /uploads/ image resolution
========================================================= */

const RECENTLY_VIEWED_KEY = "shopease_recently_viewed";

function resolveProductImage(rawImage) {
    if (!rawImage) return "images/placeholder.png";
    if (typeof rawImage === "string" && rawImage.startsWith("/uploads/")) {
        return "http://localhost:8080" + rawImage;
    }
    return rawImage;
}

// Clean single price helper (first matched number only)
function extractCleanPrice(text) {
    if (!text) return "0";
    const match = text.match(/₹?\s*([\d,]+(\.\d+)?)/);
    if (match && match[1]) {
        return match[1].replace(/,/g, "");
    }
    return text.replace(/[^\d.]/g, "").slice(0, 6) || "0";
}

window.trackRecentlyViewed = function(product) {
    if (!product || !product.id) return;
    try {
        let history = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
        // Purana duplicate remove karo
        history = history.filter(item => String(item.id) !== String(product.id));

        history.unshift({
            id: product.id,
            name: product.name,
            price: extractCleanPrice(String(product.price)),
            image: product.image,
            category: product.category || "Catalog"
        });

        history = history.slice(0, 8);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(history));

        if (typeof window.renderRecentlyViewedUI === "function") {
            window.renderRecentlyViewedUI();
        }
    } catch (e) {
        console.warn("Storage tracking failed:", e);
    }
};

// Global click event to capture view details cleanly
document.addEventListener("click", (e) => {
    // 1. Main catalog .product-details-btn
    const detailsBtn = e.target.closest(".product-details-btn, [data-product-id]");
    if (detailsBtn) {
        const pid = detailsBtn.getAttribute("data-product-id") || detailsBtn.dataset?.productId;
        const card = detailsBtn.closest(".product-card, .card");
        if (card && pid) {
            const name = card.querySelector(".product-card__title, h3, h4")?.textContent?.trim() || "Product";
            
            // Sirf main/current price element uthao
            const priceEl = card.querySelector(".product-card__price-current, .product-card__price, .price-current, .price") || card.querySelector("[class*='price']");
            const price = extractCleanPrice(priceEl?.textContent || "0");
            
            const img = card.querySelector("img")?.getAttribute("src") || "";
            const cat = card.querySelector(".product-card__category, .category")?.textContent?.trim() || "Catalog";

            trackRecentlyViewed({ id: pid, name, price, image: img, category: cat });
        }
        return;
    }

    // 2. Homepage modules (New Arrivals, Deals, Trending, Best Sellers)
    const viewBtn = e.target.closest(".new-arrival-btn, .deal-btn, .trending-btn, .bestseller-btn, [onclick*='ProductDetails']");
    if (viewBtn) {
        const card = viewBtn.closest(".new-arrival-card, .deal-card, .trending-card, .bestseller-card");
        const onclickStr = viewBtn.getAttribute("onclick") || "";
        const idMatch = onclickStr.match(/\((\d+)\)/) || onclickStr.match(/id=(\d+)/);

        if (card && idMatch && idMatch[1]) {
            const pid = idMatch[1];
            const name = card.querySelector("h4")?.textContent?.trim() || "Product";
            
            const priceEl = card.querySelector(".deal-final-price, .new-arrival-price, .bestseller-price, .trending-price") || card.querySelector("[class*='price']");
            const price = extractCleanPrice(priceEl?.textContent || "0");
            
            const img = card.querySelector("img")?.getAttribute("src") || "";
            const cat = card.querySelector("[class*='category']")?.textContent?.trim() || "Catalog";

            trackRecentlyViewed({ id: pid, name, price, image: img, category: cat });
        }
    }
});

// UI Rendering
document.addEventListener("DOMContentLoaded", () => {
    const section = document.getElementById("recentlyViewedSection");
    const container = document.getElementById("recentlyViewedContainer");
    const clearBtn = document.getElementById("clearHistoryBtn");

    if (!section || !container) return;

    window.renderRecentlyViewedUI = function() {
        const history = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];

        if (!history.length) {
            section.style.display = "none";
            return;
        }

        section.style.display = "block";
        container.innerHTML = history.map(item => {
            const imgSrc = resolveProductImage(item.image);
            const cleanPrice = extractCleanPrice(String(item.price));

            return `
                <div class="recent-card">
                    <div class="recent-img-wrapper">
                        <img src="${imgSrc}" alt="${item.name || 'Product'}" onerror="this.onerror=null;this.src='images/placeholder.png';">
                    </div>
                    <div class="recent-info">
                        <span class="recent-category">${item.category || 'Catalog'}</span>
                        <h4>${item.name || 'Product'}</h4>
                        <div class="recent-bottom">
                            <span class="recent-price">₹${cleanPrice}</span>
                            <button class="recent-btn" onclick="window.location.href='ProductDetails.html?id=${item.id}'">View</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    };

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            localStorage.removeItem(RECENTLY_VIEWED_KEY);
            section.style.display = "none";
        });
    }

    window.renderRecentlyViewedUI();
});
