// ==============================
// SEARCH SUGGESTIONS MODULE
// ==============================

(function () {

    let searchTimer = null;
    let latestRequest = 0;

    const MIN_SEARCH_LENGTH = 1;
    const SUGGESTION_LIMIT = 5;
    const DEBOUNCE_TIME = 250;


    // ==============================
    // CREATE SUGGESTION BOX
    // ==============================

    function createSuggestionBox() {

        const searchBox = document.getElementById("searchBox");

        if (!searchBox) {
            return null;
        }

        const container = searchBox.parentElement;

        let suggestionBox =
            document.getElementById("searchSuggestions");

        if (!suggestionBox) {

            suggestionBox =
                document.createElement("div");

            suggestionBox.id =
                "searchSuggestions";

            suggestionBox.className =
                "search-suggestions";

            container.appendChild(
                suggestionBox
            );
        }

        return suggestionBox;
    }


    // ==============================
    // HIDE SUGGESTIONS
    // ==============================

    function hideSuggestions() {

        const box =
            document.getElementById(
                "searchSuggestions"
            );

        if (!box) {
            return;
        }

        box.innerHTML = "";
        box.classList.remove("show");
    }


    // ==============================
    // SHOW SUGGESTIONS
    // ==============================

    function showSuggestions(products) {

        const box =
            createSuggestionBox();

        if (!box) {
            return;
        }

        box.innerHTML = "";

        products
            .slice(0, SUGGESTION_LIMIT)
            .forEach(function (product) {

                const item =
                    document.createElement("div");

                item.className =
                    "search-suggestion-item";

                item.textContent =
                    product.name;

                item.addEventListener(
                    "click",
                    function () {

                        const searchInput =
                            document.getElementById(
                                "searchBox"
                            );

                        searchInput.value =
                            product.name;

                        hideSuggestions();

                        // Existing search module
                        if (
                            typeof searchProduct ===
                            "function"
                        ) {
                            searchProduct(
                                product.name
                            );
                        }

                    }
                );

                box.appendChild(item);
            });

        if (products.length > 0) {
            box.classList.add("show");
        }
    }


    // ==============================
    // FETCH PRODUCT SUGGESTIONS
    // ==============================

    async function fetchSuggestions(value) {

        const searchValue =
            value.trim();

        if (
            searchValue.length <
            MIN_SEARCH_LENGTH
        ) {
            hideSuggestions();
            return;
        }


        const requestId =
            ++latestRequest;

        try {

            const endpoint =
                `/products/search?name=${encodeURIComponent(searchValue)}&page=0&size=50&sort=name,asc`;

            const response =
                await apiFetch(endpoint);

            if (
                !response ||
                !response.ok
            ) {
                hideSuggestions();
                return;
            }


            const responseData =
                await response.json();


            // Gateway response:
            // { data: { content: [...] } }
            //
            // Direct response:
            // { content: [...] }

            const pageData =
                responseData.data ??
                responseData;

            const products =
                pageData.content ?? [];


            // Only recommend products whose name
            // STARTS with the typed text.
            const matchingProducts =
                products.filter(function (product) {

                    const productName =
                        (product.name || "")
                            .trim()
                            .toLowerCase();

                    return productName.startsWith(
                        searchValue.toLowerCase()
                    );

                });


            // Ignore old response
            if (
                requestId !==
                latestRequest
            ) {
                return;
            }


            showSuggestions(
                matchingProducts
            );

        }
        catch (error) {

            console.error(
                "Search suggestion error:",
                error
            );

            hideSuggestions();
        }
    }


    // ==============================
    // INPUT HANDLER
    // ==============================

    function handleSearchInput(event) {

        const value =
            event.target.value;

        clearTimeout(
            searchTimer
        );

        hideSuggestions();


        searchTimer =
            setTimeout(
                function () {

                    fetchSuggestions(
                        value
                    );

                },
                DEBOUNCE_TIME
            );
    }


    // ==============================
    // INITIALIZE MODULE
    // ==============================

    function initializeSearchSuggestions() {

        const searchInput =
            document.getElementById(
                "searchBox"
            );

        if (!searchInput) {
            return;
        }


        // New module listener.
        // Existing searchProduct()
        // remains untouched.

        searchInput.addEventListener(
            "input",
            handleSearchInput
        );


        // Hide when clicking outside
        document.addEventListener(
            "click",
            function (event) {

                const searchBox =
                    document.querySelector(
                        ".search-box"
                    );

                if (
                    searchBox &&
                    !searchBox.contains(
                        event.target
                    )
                ) {
                    hideSuggestions();
                }

            }
        );


        // Hide on Escape
        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {
                    hideSuggestions();
                }

            }
        );

    }


    // ==============================
    // DOM READY
    // ==============================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeSearchSuggestions
        );

    }
    else {

        initializeSearchSuggestions();

    }

})();
