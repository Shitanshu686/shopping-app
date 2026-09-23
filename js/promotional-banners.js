/* =========================================================
   SHOP EASE - PROMOTIONAL BANNERS LOGIC
   - Triggers matching category filters
   - Scrolls to product view smoothly
========================================================= */

window.applyPromoFilter = function(categoryName) {
    if (!categoryName) return;

    // Form ka category select dhoondho
    const catSelect = document.querySelector("#categoryFilter, select[name='category'], #category");
    if (catSelect) {
        let matched = false;
        for (let option of catSelect.options) {
            if (option.text.toLowerCase().includes(categoryName.toLowerCase()) ||
                option.value.toLowerCase().includes(categoryName.toLowerCase())) {
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

    // Scroll smoothly to products section
    const catalog = document.querySelector("#productsContainer, .products-section, #productsSection");
    if (catalog) {
        catalog.scrollIntoView({ behavior: "smooth" });
    }
};
