// ======================
// ADMIN SPECIFICATION
// ======================

// Get logged-in user
const adminSpecificationUser =
    JSON.parse(
        localStorage.getItem("user")
    );


// ======================
// CHECK ADMIN ROLE
// ======================

function checkAdminSpecificationAccess() {

    const adminSection =
        document.getElementById(
            "adminSpecificationSection"
        );

    if (!adminSection) {
        return;
    }


    if (
        adminSpecificationUser &&
        adminSpecificationUser.role === "ADMIN"
    ) {

        adminSection.style.display = "block";

        adminSection.innerHTML = `

        <h2>Add Product Specification</h2>

        <form id="adminSpecificationForm">

            <div>
                <label>Specification Name</label>

                <input
                    type="text"
                    id="specificationName"
                    placeholder="e.g. Material"
                    required
                >
            </div>


            <div>
                <label>Specification Value</label>

                <input
                    type="text"
                    id="specificationValue"
                    placeholder="e.g. Polycarbonate"
                    required
                >
            </div>


            <button type="submit">
                Add Specification
            </button>

        </form>

    `;

    }

}


// ======================
// START
// ======================

checkAdminSpecificationAccess();
// ======================
// ADD SPECIFICATION
// ======================

document.addEventListener("submit", async function (event) {

    if (event.target.id !== "adminSpecificationForm") {
        return;
    }

    event.preventDefault();

    console.log("========== ADD SPECIFICATION ==========");


    const specificationName =
        document
            .getElementById("specificationName")
            .value
            .trim();

    const specificationValue =
        document
            .getElementById("specificationValue")
            .value
            .trim();


    console.log("Specification Name:", specificationName);
    console.log("Specification Value:", specificationValue);
    console.log("Product ID:", productId);


    if (!specificationName || !specificationValue) {

        console.error(
            "Specification name and value are required."
        );

        return;
    }


    try {

        const response =
            await apiFetch(
                `/products/${productId}/specifications`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        specificationName:
                            specificationName,

                        specificationValue:
                            specificationValue

                    })
                }
            );

        console.log("POST RESPONSE STATUS:", response?.status);
        if (!response) {

            console.error(
                "Specification request failed."
            );

            return;
        }
        if (response.status === 409) {

            alert("⚠️ Specification already exists");

            return;
        }
        // ======================
        // DUPLICATE SPECIFICATION
        // ======================

        if (response.status === 409) {

            showProductDetailsToast(
                "⚠️ This specification already exists"
            );

            return;
        }


        const responseData =
            await response.json();


        console.log(
            "Specification Response:",
            responseData
        );


        if (responseData.success) {

            console.log(
                "Specification added successfully."
            );

            document.getElementById(
                "adminSpecificationForm"
            ).reset();

            alert(
                "✅ Specification added successfully!"
            );

        }
        else {

            console.error(
                "Specification was not added:",
                responseData.message
            );

        }

    }
    catch (error) {

        console.error(
            "Failed to add specification:",
            error
        );

    }

});