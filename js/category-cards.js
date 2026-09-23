/* =========================================================
   SHOP EASE - DYNAMIC CATEGORY CARDS
   - Extracts categories dynamically from active products
   - Shows real live product counts
   - Triggers page filtering smoothly on click
========================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("categoryCardsContainer");
    if (!container) return;

    // Category ke liye smart icons dictionary
    const categoryIcons = {
        "electronics": "📱",
        "mobile": "📱",
        "audio": "🎧",
        "furniture": "🛋️",
        "kitchen": "🍳",
        "home": "🏠",
        "appliances": "🔌",
        "bat": "🏏",
        "sports": "⚽",
        "fashion": "👕",
        "shoes": "👟",
        "clothing": "👗",
        "beauty": "💄",
        "grocery": "🛒"
    };

    function getCategoryIcon(catName) {
        if (!catName) return "📦";
        const lower = catName.toLowerCase().trim();
        for (const [key, icon] of Object.entries(categoryIcons)) {
            if (lower.includes(key)) return icon;
        }
        return "📦";
    }

    try {
        const productRes = await fetchProducts(0, 100);
        const products = productRes?.content || [];

        if (!products.length) {
            container.parentElement.style.display = "none";
            return;
        }

        // 1. Group products by Category and count them
        const categoryMap = {};

        products.forEach(p => {
            const rawCat = p.category?.name || p.category;
            if (rawCat && typeof rawCat === "string" && rawCat.trim() !== "") {
                const cleanCat = rawCat.trim();
                categoryMap[cleanCat] = (categoryMap[cleanCat] || 0) + 1;
            }
        });

        const categories = Object.keys(categoryMap);

        if (!categories.length) {
            container.parentElement.style.display = "none";
            return;
        }

        // 2. Render cards
        container.innerHTML = categories.map(cat => {
            const count = categoryMap[cat];
            const icon = getCategoryIcon(cat);

            return `
                <div class="category-card" data-category="${cat}">
                    <div class="category-icon-wrapper">${icon}</div>
                    <div class="category-card-title">${cat}</div>
                    <span class="category-card-count">${count} ${count === 1 ? "Item" : "Items"}</span>
                </div>
            `;
        }).join("");

        // 3. Click handler: Category filter trigger karna
        container.querySelectorAll(".category-card").forEach(card => {
            card.addEventListener("click", () => {
                const chosenCategory = card.getAttribute("data-category");
                applyCategorySelection(chosenCategory);
            });
        });

    } catch (err) {
        console.error("Category Cards Error:", err);
        container.parentElement.style.display = "none";
    }

    function applyCategorySelection(categoryName) {
        // Form ke andar jo category select dropdown hai usko match karo
        const catSelect = document.querySelector("#categoryFilter, select[name='category'], #category");
        if (catSelect) {
            let matched = false;
            for (let option of catSelect.options) {
                if (option.text.toLowerCase().trim() === categoryName.toLowerCase().trim() ||
                    option.value.toLowerCase().trim() === categoryName.toLowerCase().trim()) {
                    catSelect.value = option.value;
                    matched = true;
                    break;
                }
            }
            if (matched) {
                catSelect.dispatchEvent(new Event("change"));
                const applyBtn = document.querySelector("#applyFilterBtn, button[type='submit']");
                if (applyBtn) applyBtn.click();
            }
        }

        // Smooth scroll to the main product catalog section
        const productCatalog = document.querySelector("#productsContainer, .products-section, #productsSection");
        if (productCatalog) {
            productCatalog.scrollIntoView({ behavior: "smooth" });
        }
    }
});
