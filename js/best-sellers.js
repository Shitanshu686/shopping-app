/* =========================================================
   SHOP EASE - DYNAMIC REAL BEST SELLERS
   Ranks products strictly by cumulative sales volume.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("bestSellersProductsContainer");
    if (!container) return;

    try {
        // 1. Fetch available store products
        const productRes = await fetchProducts(0, 100);
        const allProducts = productRes?.content || [];

        if (!allProducts.length) {
            renderBestSellersEmpty("No products found in the catalog.");
            return;
        }

        // 2. Aggregate sold quantities across all available orders
        const salesVolumeMap = {};

        async function processOrdersList(orderList) {
            if (!Array.isArray(orderList)) return;
            for (const order of orderList) {
                let items = order.items || order.orderItems || [];
                
                if ((!items || items.length === 0) && order.orderId && typeof fetchOrderById === "function") {
                    try {
                        const detailed = await fetchOrderById(order.orderId);
                        if (detailed && detailed.items) {
                            items = detailed.items;
                        }
                    } catch (_) {}
                }

                items.forEach(item => {
                    const pId = item.productId || item.product?.id || item.id;
                    const qty = Number(item.quantity) || 1;
                    if (pId) {
                        salesVolumeMap[pId] = (salesVolumeMap[pId] || 0) + qty;
                    }
                });
            }
        }

        // Fetch orders from global admin endpoint if possible
        try {
            if (typeof apiFetch === "function") {
                const adminOrdersRes = await apiFetch("/orders/admin");
                if (adminOrdersRes && adminOrdersRes.ok) {
                    const data = await adminOrdersRes.json();
                    await processOrdersList(data?.data || data || []);
                }
            }
        } catch (_) {}

        // Fetch logged-in user orders as fallback
        try {
            if (typeof fetchOrders === "function") {
                const userOrders = await fetchOrders();
                await processOrdersList(userOrders || []);
            }
        } catch (_) {}

        // 3. Filter: Product must be in stock AND must have units sold > 0
        const bestSellerList = allProducts
            .filter(p => Number(p.stock) > 0 && salesVolumeMap[p.id] && salesVolumeMap[p.id] > 0)
            .sort((a, b) => (salesVolumeMap[b.id] || 0) - (salesVolumeMap[a.id] || 0))
            .slice(0, 8);

        // 4. Empty state check
        if (!bestSellerList.length) {
            renderBestSellersEmpty("No best sellers recorded yet. Top purchased items will appear here!");
            return;
        }

        // 5. Render Best Seller cards with Rank tags
        renderBestSellerCards(bestSellerList, salesVolumeMap);

    } catch (err) {
        console.error("Best Sellers Load Error:", err);
        renderBestSellersEmpty("Unable to load best sellers right now.");
    }

    function renderBestSellersEmpty(message) {
        container.innerHTML = `
            <div class="bestsellers-empty-state">
                <span>🏆</span>
                <h3>No Best Sellers Yet</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function renderBestSellerCards(products, volumeMap) {
        container.innerHTML = products.map((product, index) => {
            const soldTotal = volumeMap[product.id] || 1;
            const imgSrc = product.imageUrl || product.image || "images/placeholder.png";
            const rankBadge = `#${index + 1} Best Seller`;

            return `
                <div class="bestseller-card">
                    <div class="bestseller-img-wrapper">
                        <span class="bestseller-rank-tag">🏆 ${rankBadge}</span>
                        <img src="${imgSrc}" alt="${product.name}" onerror="this.src='images/placeholder.png'">
                    </div>
                    <div class="bestseller-info">
                        <h4>${product.name}</h4>
                        <div class="bestseller-meta">⭐ ${soldTotal} total sold</div>
                        <div class="bestseller-bottom">
                            <span class="bestseller-price">₹${product.price}</span>
                            <button class="bestseller-btn" onclick="viewProductDetails ? viewProductDetails(${product.id}) : window.location.href='ProductDetails.html?id=${product.id}'">View</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }
});
