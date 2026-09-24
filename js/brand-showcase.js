/* =========================================================
   SHOP EASE - BRAND SHOWCASE FILTER LOGIC
========================================================= */

window.filterByBrand = function(brandName) {
    if (!brandName) return;

    // 1. Highlight active brand card
    document.querySelectorAll(".brand-card").forEach(c => {
        c.classList.toggle("active", c.getAttribute("data-brand") === brandName);
    });

    // 2. Search input check karo aur set karo
    const searchInput = document.querySelector("#searchInput, #searchBox, input[type='search']");
    if (searchInput) {
        searchInput.value = brandName;
        searchInput.dispatchEvent(new Event("input"));
        searchInput.dispatchEvent(new Event("keyup"));
    }

    // 3. Fallback: Search form submit ya button click
    const searchBtn = document.querySelector("#searchBtn, .search-btn, button[type='submit']");
    if (searchBtn && searchInput) {
        searchBtn.click();
    }

    // 4. Smooth scroll to products view
    const productsView = document.querySelector("#productsContainer, .products-section, #productsSection");
    if (productsView) {
        productsView.scrollIntoView({ behavior: "smooth" });
    }
};
