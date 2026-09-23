/* =========================================================
   SHOP EASE - REAL-TIME DEALS OF THE DAY
   - Deterministic daily rotation using calendar date seed
   - Live countdown to 11:59:59 PM (Midnight)
   - Real calculated discounts on existing catalog items
   - Proper /uploads/ image resolution
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("dealsContainer");
    if (!container) return;

    startMidnightCountdown();

    try {
        const productRes = await fetchProducts(0, 100);
        const allProducts = productRes?.content || [];

        const available = allProducts.filter(p => Number(p.stock) > 0);

        if (!available.length) {
            renderDealsEmpty("No active products available for today's deals.");
            return;
        }

        const today = new Date();
        const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

        const shuffled = [...available].sort((a, b) => {
            const hashA = (Number(a.id) * 9301 + dateSeed * 49297) % 233280;
            const hashB = (Number(b.id) * 9301 + dateSeed * 49297) % 233280;
            return hashA - hashB;
        });

        const todaysDeals = shuffled.slice(0, 4).map((p, idx) => {
            const discountPercent = 15 + (idx % 4) * 5;
            const origPrice = Number(p.price);
            const dealPrice = Math.round(origPrice * (1 - discountPercent / 100));

            return {
                ...p,
                discountPercent,
                dealPrice
            };
        });

        renderDealCards(todaysDeals);

    } catch (err) {
        console.error("Deals of the Day Load Error:", err);
        renderDealsEmpty("Unable to load daily deals at the moment.");
    }

    function resolveProductImage(rawImage) {
        if (!rawImage) return "images/placeholder.png";
        if (typeof rawImage === "string" && rawImage.startsWith("/uploads/")) {
            return "http://localhost:8080" + rawImage;
        }
        return rawImage;
    }

    function renderDealsEmpty(message) {
        container.innerHTML = `
            <div class="deals-empty-state">
                <span>⏳</span>
                <h3>No Deals Available</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function renderDealCards(deals) {
        container.innerHTML = deals.map(product => {
            const rawImg = product.image || product.imageUrl;
            const imgSrc = resolveProductImage(rawImg);
            const categoryName = product.category?.name || product.category || "Special Deal";

            return `
                <div class="deal-card">
                    <div class="deal-img-wrapper">
                        <span class="deal-discount-pill">🔥 ${product.discountPercent}% OFF</span>
                        <img src="${imgSrc}" alt="${product.name}" onerror="this.onerror=null;this.src='images/placeholder.png';">
                    </div>
                    <div class="deal-info">
                        <span class="deal-category">${categoryName}</span>
                        <h4>${product.name}</h4>
                        <div class="deal-pricing">
                            <span class="deal-final-price">₹${product.dealPrice}</span>
                            <span class="deal-original-price">₹${product.price}</span>
                        </div>
                        <div class="deal-bottom">
                            <span class="deal-stock-status">⚡ Limited Stock</span>
                            <button class="deal-btn" onclick="viewProductDetails ? viewProductDetails(${product.id}) : window.location.href='ProductDetails.html?id=${product.id}'">Grab Deal</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    function startMidnightCountdown() {
        const hEl = document.getElementById("dealHours");
        const mEl = document.getElementById("dealMins");
        const sEl = document.getElementById("dealSecs");
        if (!hEl || !mEl || !sEl) return;

        function updateTimer() {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(23, 59, 59, 999);

            const diff = midnight - now;
            if (diff <= 0) {
                hEl.textContent = "00";
                mEl.textContent = "00";
                sEl.textContent = "00";
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            hEl.textContent = String(hours).padStart(2, "0");
            mEl.textContent = String(minutes).padStart(2, "0");
            sEl.textContent = String(seconds).padStart(2, "0");
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }
});
