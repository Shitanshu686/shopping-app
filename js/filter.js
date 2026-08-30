// ======================
// FILTER STATE
// ======================

let currentFilters = {

    name: "",

    category: "",

    brand: "",

    minPrice: "",

    maxPrice: "",

    minRating: ""

};


// ==============================
// FILTER ACTIVE STATE
// ==============================

let filtersAreActive = false;



// ==============================
// APPLY PRODUCT FILTERS
// ==============================

async function applyFilters(page = 0) {

    try {

        const params = new URLSearchParams();


        if (currentFilters.name) {

            params.append(
                "name",
                currentFilters.name
            );

        }


        if (currentFilters.category) {

            params.append(
                "category",
                currentFilters.category
            );

        }


        if (currentFilters.brand) {

            params.append(
                "brand",
                currentFilters.brand
            );

        }


        if (currentFilters.minPrice) {

            params.append(
                "minPrice",
                currentFilters.minPrice
            );

        }


        if (currentFilters.maxPrice) {

            params.append(
                "maxPrice",
                currentFilters.maxPrice
            );

        }


        if (currentFilters.minRating) {

            params.append(
                "minRating",
                currentFilters.minRating
            );

        }


        params.append("page", page);

        params.append("size", 20);


        // ==============================
        // APPLY CURRENT SORTING
        // ==============================

        if (
            currentSortBy &&
            currentSortDirection
        ) {

            params.append(
                "sort",
                `${currentSortBy},${currentSortDirection}`
            );

        }


        // ==============================
        // API REQUEST
        // ==============================

        const response =
            await apiFetch(
                `/products/filter?${params.toString()}`
            );


        if (!response) {

            showToast(
                "❌ Unable to load filtered products"
            );

            return;

        }


        const responseData =
            await response.json();


        const data =
            responseData.data;


        // ==============================
        // NO PRODUCTS FOUND
        // ==============================

        if (
            !data ||
            data.content.length === 0
        ) {

            const productDiv =
                document.getElementById("products");

            productDiv.innerHTML = `
    <div class="no-products">

        <div class="no-products-icon">
            🔍
        </div>

        <h2>
            No Products Found
        </h2>

        <p>
            We couldn't find any products matching your filters.
        </p>

        <button
            class="no-products-btn"
            onclick="document.getElementById('clearFiltersButton').click()"
        >
            Clear Filters
        </button>

    </div>
`;

            // Hide pagination

            const pagination =
                document.getElementById("pagination");

            if (pagination) {

                pagination.innerHTML = "";

            }

            return;
        }
        // ==============================
        // SHOW ACTIVE FILTERS
        // ==============================

        let activeFilterText = [];

        if (currentFilters.name) {
            activeFilterText.push(
                `Name: ${currentFilters.name}`
            );
        }

        if (currentFilters.category) {
            activeFilterText.push(
                `Category: ${currentFilters.category}`
            );
        }

        if (currentFilters.brand) {
            activeFilterText.push(
                `Brand: ${currentFilters.brand}`
            );
        }

        if (currentFilters.minPrice) {
            activeFilterText.push(
                `Min Price: ₹${currentFilters.minPrice}`
            );
        }

        if (currentFilters.maxPrice) {
            activeFilterText.push(
                `Max Price: ₹${currentFilters.maxPrice}`
            );
        }

        if (currentFilters.minRating) {
            activeFilterText.push(
                `Rating: ${currentFilters.minRating}+`
            );
        }
        // ==============================
        // DISPLAY ACTIVE FILTERS
        // ==============================

        const activeFilters =
            document.getElementById("activeFilters");

        if (activeFilters) {

            if (activeFilterText.length > 0) {

                activeFilters.innerHTML = `
            <div class="active-filters-title">
                Active Filters
            </div>

            <div class="active-filter-list">
                ${activeFilterText.map(filter => `
                    <span class="active-filter">
                        ${filter}
                    </span>
                `).join("")}
            </div>
        `;

            }
            else {

                activeFilters.innerHTML = "";

            }

        }

        // ==============================
        // RENDER FILTERED PRODUCTS
        // ==============================

        renderProducts(
            data.content
        );

        renderPagination(
            data.number,
            data.totalPages
        );


        attachCartEvents();

        syncWishlistButtons();

    }
    catch (error) {

        console.error(
            "Failed to apply filters:",
            error
        );


        showToast(
            "❌ Unable to apply filters"
        );

    }

}


// ==============================
// FILTER EVENT
// ==============================

document
    .getElementById("applyFiltersButton")
    .addEventListener(
        "click",
        function () {


            currentFilters.name =
                document
                    .getElementById("filterName")
                    .value
                    .trim();


            currentFilters.category =
                document
                    .getElementById("filterCategory")
                    .value;


            currentFilters.brand =
                document
                    .getElementById("filterBrand")
                    .value
                    .trim();


            currentFilters.minPrice =
                document
                    .getElementById("minPrice")
                    .value;


            currentFilters.maxPrice =
                document
                    .getElementById("maxPrice")
                    .value;


            currentFilters.minRating =
                document
                    .getElementById("minRating")
                    .value;


            // ==============================
            // FILTER IS ACTIVE
            // ==============================

            filtersAreActive = true;


            applyFilters(0);

        }
    );
// ==============================
// CLEAR ALL FILTERS
// ==============================

document
    .getElementById("clearFiltersButton")
    .addEventListener(
        "click",
        function () {

            currentFilters.name = "";

            currentFilters.category = "";

            currentFilters.brand = "";

            currentFilters.minPrice = "";

            currentFilters.maxPrice = "";

            currentFilters.minRating = "";


            // Clear input fields

            document
                .getElementById("filterName")
                .value = "";

            document
                .getElementById("filterCategory")
                .value = "";

            document
                .getElementById("filterBrand")
                .value = "";

            document
                .getElementById("minPrice")
                .value = "";

            document
                .getElementById("maxPrice")
                .value = "";

            document
                .getElementById("minRating")
                .value = "";


            // Filter is no longer active

            filtersAreActive = false;
            currentSortBy = "";

            currentSortDirection = "";
            const activeFilters =
                document.getElementById("activeFilters");

            if (activeFilters) {

                activeFilters.innerHTML = "";

            }
            document
                .getElementById("sortProducts")
                .value = "";


            // Load normal products

            loadProducts(0);

        }
    );