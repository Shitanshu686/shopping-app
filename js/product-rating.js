// ======================
// PRODUCT RATING
// ======================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const container =
            document.getElementById(
                "ratingFormContainer"
            );


        if (!container) {
            return;
        }


        // ======================
        // GET PRODUCT ID
        // ======================

        const params =
            new URLSearchParams(
                window.location.search
            );


        const productId =
            params.get("id");


        if (!productId) {
            return;
        }


        // ======================
        // CHECK ELIGIBILITY
        // ======================

        checkRatingEligibility(
            productId
        );

    }
);


// ======================
// CHECK RATING ELIGIBILITY
// ======================

async function checkRatingEligibility(
    productId
) {

    const container =
        document.getElementById(
            "ratingFormContainer"
        );


    const message =
        document.getElementById(
            "ratingMessage"
        );


    try {

        const response =
            await apiFetch(
                `/ratings/can-rate/${productId}`
            );


        if (!response) {
            return;
        }


        const responseData =
            await response.json();


        const canRate =
            responseData.data;


        if (canRate) {

            // ======================
            // USER CAN RATE
            // ======================

            showRatingForm(
                productId
            );


        } else {

            // ======================
            // USER CANNOT RATE
            // ======================

            container.innerHTML = "";


            if (message) {

                message.textContent =
                    "Only verified buyers who received this product can rate it.";

            }

        }

    }
    catch (error) {

        console.error(
            "Failed to check rating eligibility:",
            error
        );

    }

}


// ======================
// SHOW RATING FORM
// ======================

async function showRatingForm(
    productId
) {

    const container =
        document.getElementById(
            "ratingFormContainer"
        );


    container.innerHTML = `

        <div class="rating-form">

            <label class="rating-label">
                Your Rating
            </label>


            <div class="rating-stars">

                <span
                    class="rating-star"
                    data-rating="1"
                >
                    ★
                </span>

                <span
                    class="rating-star"
                    data-rating="2"
                >
                    ★
                </span>

                <span
                    class="rating-star"
                    data-rating="3"
                >
                    ★
                </span>

                <span
                    class="rating-star"
                    data-rating="4"
                >
                    ★
                </span>

                <span
                    class="rating-star"
                    data-rating="5"
                >
                    ★
                </span>

            </div>


            <button
                type="button"
                class="rating-submit-btn"
            >
                Submit Rating
            </button>


            <p
                id="ratingFormMessage"
                class="rating-message"
            ></p>

        </div>

    `;


    // ======================
    // LOAD EXISTING RATING
    // ======================

    const existingRating =
        await getMyRating(
            productId
        );


    initializeRatingStars(
        productId,
        existingRating
    );

}


// ======================
// GET MY EXISTING RATING
// ======================

async function getMyRating(
    productId
) {

    try {

        const response =
            await apiFetch(
                `/ratings/my-rating/${productId}`
            );


        if (!response) {
            return null;
        }


        const responseData =
            await response.json();


        if (
            !responseData.data
        ) {

            return null;

        }


        return Number(
            responseData.data.rating
        );

    }
    catch (error) {

        console.error(
            "Failed to load existing rating:",
            error
        );


        return null;
    }

}


// ======================
// STAR SELECTION
// ======================

function initializeRatingStars(
    productId,
    existingRating
) {

    const stars =
        document.querySelectorAll(
            ".rating-star"
        );


    let selectedRating =
        existingRating || 0;


    // ======================
    // SHOW EXISTING RATING
    // ======================

    if (selectedRating > 0) {

        updateSelectedStars(
            stars,
            selectedRating
        );

    }


    // ======================
    // STAR CLICK
    // ======================

    stars.forEach(function (star) {

        star.addEventListener(
            "click",
            function () {

                selectedRating =
                    Number(
                        this.dataset.rating
                    );


                updateSelectedStars(
                    stars,
                    selectedRating
                );

            }
        );

    });


    // ======================
    // SUBMIT RATING
    // ======================

    const submitButton =
        document.querySelector(
            ".rating-submit-btn"
        );


    submitButton.addEventListener(
        "click",
        function () {

            if (
                selectedRating === 0
            ) {

                const message =
                    document.getElementById(
                        "ratingFormMessage"
                    );


                message.textContent =
                    "Please select a rating.";


                message.className =
                    "rating-message error";


                return;

            }


            submitRating(
                productId,
                selectedRating
            );

        }
    );

}


// ======================
// UPDATE SELECTED STARS
// ======================

function updateSelectedStars(
    stars,
    selectedRating
) {

    stars.forEach(function (star) {

        const itemRating =
            Number(
                star.dataset.rating
            );


        if (
            itemRating <=
            selectedRating
        ) {

            star.classList.add(
                "active"
            );

        } else {

            star.classList.remove(
                "active"
            );

        }

    });

}


// ======================
// SUBMIT RATING
// ======================

async function submitRating(
    productId,
    rating
) {

    const message =
        document.getElementById(
            "ratingFormMessage"
        );


    try {

        const response =
            await apiFetch(
                "/ratings",
                {
                    method: "POST",

                    body: JSON.stringify({

                        productId:
                            Number(productId),

                        rating:
                            rating

                    })
                }
            );


        if (!response) {
            return;
        }


        const responseData =
            await response.json();


        if (
            response.ok &&
            responseData.success
        ) {

            message.textContent =
                "✅ Rating submitted successfully.";

            message.className =
                "rating-message success";


            // ======================
            // REFRESH PRODUCT AVERAGE
            // ======================

            refreshProductAverageRating(
                productId
            );


        } else {

            message.textContent =
                responseData.message ||
                "Failed to submit rating.";

            message.className =
                "rating-message error";

        }

    }
    catch (error) {

        console.error(
            "Failed to submit rating:",
            error
        );


        message.textContent =
            "Something went wrong while submitting rating.";

        message.className =
            "rating-message error";

    }

}


// ======================
// REFRESH PRODUCT AVERAGE
// ======================

async function refreshProductAverageRating(
    productId
) {

    try {

        const response =
            await apiFetch(
                `/ratings/product/${productId}`
            );


        if (!response) {
            return;
        }


        const responseData =
            await response.json();


        const averageRating =
            responseData.data;


        if (
            averageRating !== null &&
            averageRating !== undefined
        ) {

            updateProductRating(
                averageRating
            );

        }

    }
    catch (error) {

        console.error(
            "Failed to refresh product rating:",
            error
        );

    }

}