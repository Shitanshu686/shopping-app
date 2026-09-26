document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:8080/products?page=0&size=4")
        .then(res => res.json())
        .then(data => {
            const items = data?.data?.content || data?.content || [];
            const container = document.getElementById("recommendedProductsContainer");
            if (container && items.length) {
                container.innerHTML = items.map(p => `
                    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:15px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                        <img src="${p.image || 'images/placeholder.png'}" style="height:140px; width:100%; object-fit:contain;" onerror="this.src='images/placeholder.png'">
                        <h4 style="margin:10px 0 5px; color:#1e293b; font-size:15px;">${p.name}</h4>
                        <p style="font-weight:bold; color:#0f172a; margin-bottom:10px;">₹${Number(p.price).toLocaleString("en-IN")}</p>
                        <button onclick="typeof addToCart === 'function' ? addToCart(${p.id}) : null" style="background:#0f172a; color:#fff; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; width:100%;">🛒 Add to Cart</button>
                    </div>
                `).join("");
            }
        })
        .catch(err => console.error("Recommended fetch error:", err));
});
