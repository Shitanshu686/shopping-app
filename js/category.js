// ======================
// CATEGORY MODULE
// ======================

function filterByCategory(category) {

    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {

        const productCategory = card.dataset.category;

        if (category === "All" || productCategory === category) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}
// ======================
// CATEGORY BUTTON EVENTS
// ======================

const categoryButtons = document.querySelectorAll(".categories button");

categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        const category = this.dataset.category;

        filterByCategory(category);

    });

});