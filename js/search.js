// ======================
// SEARCH MODULE
// ======================

let searchTimer;


// ======================
// SEARCH PRODUCT
// ======================

function searchProduct(value) {

    currentFilters.name =
        value.trim();


    clearTimeout(searchTimer);


    searchTimer = setTimeout(
        function () {

            if (value.trim()) {

                filtersAreActive = true;

                applyFilters(0);

            }
            else {

                filtersAreActive = false;

                applyFilters(0);

            }

        },
        500
    );

}