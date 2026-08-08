// ======================
// SEARCH MODULE
// ======================

function searchProduct(value) {

    value = value.toLowerCase();

    let cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {

        let name = card.querySelector("h3").textContent.toLowerCase();

        if (name.includes(value)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });
}