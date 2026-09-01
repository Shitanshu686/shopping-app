// ======================
// IMAGE UPLOAD MODULE
// ======================

async function uploadProductImage(file) {

    if (!file) {

        return null;

    }


    // ======================
    // VALIDATE FILE TYPE
    // ======================

    if (!file.type.startsWith("image/")) {

        showProductMessage(
            "Please select a valid image file."
        );

        return null;

    }


    // ======================
    // CREATE FORM DATA
    // ======================

    const formData =
        new FormData();

    formData.append(
        "image",
        file
    );


    try {

        // ======================
        // UPLOAD IMAGE
        // ======================

        const response =
            await apiFetch(
                "/images/upload",
                {
                    method: "POST",

                    body: formData
                }
            );


        if (!response) {

            showProductMessage(
                "Unable to upload image."
            );

            return null;

        }


        const imageURL =
            await response.text();


        // ======================
        // CHECK IMAGE URL
        // ======================

        if (!imageURL) {

            showProductMessage(
                "Image upload failed."
            );

            return null;

        }


        // ======================
        // RETURN IMAGE URL
        // ======================

        return imageURL;
    }
    catch (error) {

        console.error(
            "Image upload failed:",
            error
        );

        showProductMessage(
            "Unable to upload image."
        );

        return null;

    }

}
// ======================
// IMAGE FILE SELECTION
// ======================

document
    .getElementById("productImageFile")
    .addEventListener("change", function () {

        const file =
            this.files[0];

        const preview =
            document.getElementById("imagePreview");


        if (!file) {

            preview.src = "";

            preview.style.display = "none";

            return;

        }


        // ======================
        // SHOW IMAGE PREVIEW
        // ======================

        const imageURL =
            URL.createObjectURL(file);


        preview.src =
            imageURL;

        preview.style.display =
            "block";

    });