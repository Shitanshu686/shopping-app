// ======================
// PRODUCT DETAILS
// ======================

document.addEventListener("click", function (event) {

    const detailsButton =
        event.target.closest(".product-details-btn");

    if (!detailsButton) {
        return;
    }

    const productId =
        detailsButton.dataset.productId;

    window.location.href =
        `ProductDetails.html?id=${productId}`;

});