// ======================
// PRODUCT ID
// ======================

const specificationParams =
    new URLSearchParams(window.location.search);

const specificationProductId =
    specificationParams.get("id");


// ======================
// LOAD PRODUCT SPECIFICATIONS
// ======================

async function loadProductSpecifications() {

    try {

        const response =
            await apiFetch(
                `/products/${specificationProductId}/specifications`
            );

        if (!response) {
            return;
        }

        const responseData =
            await response.json();

        const specifications =
            responseData.data;

        renderSpecifications(specifications);

    }
    catch (error) {

        console.error(
            "Failed to load product specifications:",
            error
        );

    }

}


// ======================
// RENDER SPECIFICATIONS
// ======================

function renderSpecifications(specifications) {

    const container =
        document.getElementById(
            "productSpecifications"
        );

    if (!container) {
        return;
    }

    if (
        !specifications ||
        specifications.length === 0
    ) {

        container.innerHTML = `
            <p class="no-specifications">
                No specifications available.
            </p>
        `;

        return;
    }

    container.innerHTML =
        specifications.map(
            specification => `

                <div class="specification-row">

                    <span>
                        ${specification.specificationName}
                    </span>

                    <strong>
                        ${specification.specificationValue}
                    </strong>

                </div>

            `
        ).join("");

}


// ======================
// START
// ======================

loadProductSpecifications();