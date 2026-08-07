// ======================
// CART EVENTS
// ======================

function attachCartEvents() {

    document.querySelectorAll(".add-cart-btn").forEach(button => {

        button.addEventListener("click", function () {

            const productName = this.dataset.name;
            const productPrice = Number(this.dataset.price);

            addToCart(productName, productPrice);

        });

    });
    // ======================
    // INITIALIZE CART
    // ======================

    function initializeCart() {

        attachCartEvents();

    }
}