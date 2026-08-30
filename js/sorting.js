// ======================
// SORTING STATE
// ======================

let currentSortBy = "";

let currentSortDirection = "";


// ======================
// PRODUCT SORTING
// ======================

async function changeSorting(sortValue) {

    // ======================
    // DEFAULT SORTING
    // ======================

    if (!sortValue) {

        currentSortBy = "";

        currentSortDirection = "";


        if (filtersAreActive) {

            applyFilters(0);

        }
        else {

            loadProducts(0);

        }

        return;

    }


    // ======================
    // GET SORTING VALUES
    // ======================

    const [sortBy, direction] =
        sortValue.split(",");


    currentSortBy = sortBy;

    currentSortDirection = direction;


    // ======================
    // LOAD FIRST PAGE
    // ======================

    if (filtersAreActive) {

        applyFilters(0);

    }
    else {

        loadProducts(0);

    }

}


// ======================
// SORTING EVENT
// ======================

document
    .getElementById("sortProducts")
    .addEventListener(
        "change",
        function () {

            changeSorting(this.value);

        }
    );