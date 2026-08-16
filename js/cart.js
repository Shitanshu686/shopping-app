// ======================
// CART EVENTS
// ======================

function attachCartEvents() {

    document.querySelectorAll(".add-cart-btn").forEach(button => {

        button.addEventListener("click", function () {

            const productId =
                Number(this.dataset.id);

            const productName =
                this.dataset.name;

            const productPrice =
                Number(this.dataset.price);

            const productImage =
                this.dataset.image;

            addToCart(
                productId,
                productName,
                productPrice,
                productImage
            );

        });

    });

}


// ======================
// INITIALIZE CART
// ======================

function initializeCart() {

    attachCartEvents();

}