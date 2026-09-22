/* =========================================================
   SHOP EASE - DYNAMIC REAL TRENDING PRODUCTS
   Only displays products bought by users. No dummy data.
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("trendingProductsContainer");
    if (!container) return;

    try {
        // 1. Fetch available store products
        const productRes = await fetchProducts(0, 100);
        const allProducts = productRes?.content || [];

        if (!allProducts.length) {
            renderTrendingEmpty("No products found in the catalog.");
            return;
        }

        // 2. Aggregate sold quantities across all available order endpoints
        const salesMap = {};

        async function processOrdersList(orderList) {
            if (!Array.isArray(orderList)) return;
            for (const order of orderList) {
                let items = order.items || order.orderItems || [];
                
                // If items list is empty, fetch order details if function exists
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
                        salesMap[pId] = (salesMap[pId] || 0) + qty;
                    }
                });
            }
        }

        // Try Global Admin Orders (all platform users)
        try {
            if (typeof apiFetch === "function") {
                const adminOrdersRes = await apiFetch("/orders/admin");
                if (adminOrdersRes && adminOrdersRes.ok) {
                    const data = await adminOrdersRes.json();
                    await processOrdersList(data?.data || data || []);
                }
            }
        } catch (_) {}

        // Try Current User Orders via fetchOrders() as supplemental
        try {
            if (typeof fetchOrders === "function") {
                const userOrders = await fetchOrders();
                await processOrdersList(userOrders || []);
            }
        } catch (_) {}

        // 3. Filter: Product must be in stock AND must have real purchases (salesMap > 0)
        const qualifiedTrending = allProducts
            .filter(p => Number(p.stock) > 0 && salesMap[p.id] && salesMap[p.id] > 0)
            .sort((a, b) => (salesMap[b.id] || 0) - (salesMap[a.id] || 0))
            .slice(0, 8);

        // 4. If no purchases made yet, display clean empty state
        if (!qualifiedTrending.length) {
            renderTrendingEmpty("No trending products currently. Items will appear here as users make purchases!");
            return;
        }

        // 5. Render real trending cards
        renderTrendingProducts(qualifiedTrending, salesMap);

    } catch (err) {
        console.error("Trending Products Load Error:", err);
        renderTrendingEmpty("Unable to load trending products right now.");
    }

    function renderTrendingEmpty(message) {
        container.innerHTML = `
            <div class="trending-empty-state">
                <span>📦</span>
                <h3>No Trending Products</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function renderTrendingProducts(products, sales) {
        container.innerHTML = products.map(product => {
            const soldCount = sales[product.id] || 1;
            const imgSrc = product.imageUrl || product.image || "images/placeholder.png";

            return `
                <div class="trending-card">
                    <div class="trending-img-wrapper">
                        <span class="trending-tag">🔥 Trending</span>
                        <img src="${imgSrc}" alt="${product.name}" onerror="this.src='images/placeholder.png'">
                    </div>
                    <div class="trending-info">
                        <h4>${product.name}</h4>
                        <div class="trending-meta">✓ ${soldCount} order(s) placed</div>
                        <div class="trending-bottom">
                            <span class="trending-price">₹${product.price}</span>
                            <button class="trending-btn" onclick="viewProductDetails ? viewProductDetails(${product.id}) : window.location.href='ProductDetails.html?id=${product.id}'">View</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }
});
