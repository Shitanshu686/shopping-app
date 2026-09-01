// ======================
// ADMIN PRODUCT MANAGEMENT
// ======================


// ======================
// STATE
// ======================

let products = [];

let editingProductId = null;


// ======================
// LOAD PRODUCTS
// ======================

async function loadAdminProducts() {

    try {

        const response =
            await apiFetch(
                "/products?page=0&size=1000"
            );

        if (!response) {

            showProductMessage(
                "Unable to load products."
            );

            return;

        }

        const responseData =
            await response.json();

        const data =
            responseData.data;

        products =
            data.content || [];

        renderProducts(products);

    }
    catch (error) {

        console.error(
            "Failed to load products:",
            error
        );

        showProductMessage(
            "Unable to load products."
        );

    }

}


// ======================
// RENDER PRODUCTS
// ======================

function renderProducts(productList) {

    const tableBody =
        document.getElementById(
            "productTableBody"
        );

    tableBody.innerHTML = "";


    if (!productList.length) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="8">
                    No products found.
                </td>

            </tr>

        `;

        return;

    }


    productList.forEach(product => {

        const row =
            document.createElement("tr");


        const imageSrc =
            product.image &&
                product.image.startsWith("/uploads/")
                ? `${API_BASE_URL}${product.image}`
                : product.image;


        row.innerHTML = `

        <td>
            ${product.id}
        </td>

        <td>

            <img
                src="${imageSrc}"
                alt="${product.name}"
                class="admin-product-image"
            >

        </td>

        <td>
            ${product.name}
        </td>

        <td>
            ${product.brand}
        </td>

        <td>
            ${product.category}
        </td>

        <td>
            ₹${product.price}
        </td>

        <td>
            ${product.stock}
        </td>

        <td>

            <div class="product-actions">

                <button
                    onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button
                    onclick="deleteProduct(${product.id})">
                    Delete
                </button>

            </div>

        </td>

    `;


        tableBody.appendChild(row);

    });

}

// ======================
// SEARCH PRODUCTS
// ======================

function searchAdminProducts() {

    const searchValue =
        document
            .getElementById(
                "productSearchInput"
            )
            .value
            .toLowerCase()
            .trim();


    const filteredProducts =
        products.filter(product => {

            return (

                product.name
                    .toLowerCase()
                    .includes(searchValue)

                ||

                product.brand
                    .toLowerCase()
                    .includes(searchValue)

                ||

                product.category
                    .toLowerCase()
                    .includes(searchValue)

            );

        });


    renderProducts(
        filteredProducts
    );

}


// ======================
// OPEN ADD FORM
// ======================

function openAddProductForm() {

    editingProductId = null;


    document.getElementById(
        "productFormTitle"
    ).textContent =
        "Add Product";


    document.getElementById(
        "saveProductButton"
    ).textContent =
        "Save Product";


    document.getElementById(
        "productForm"
    ).reset();


    document.getElementById(
        "productFormSection"
    ).style.display =
        "block";

}


// ======================
// EDIT PRODUCT
// ======================

function editProduct(productId) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) {

        return;

    }


    editingProductId =
        productId;


    document.getElementById(
        "productFormTitle"
    ).textContent =
        "Edit Product";


    document.getElementById(
        "saveProductButton"
    ).textContent =
        "Update Product";


    document.getElementById(
        "productName"
    ).value =
        product.name || "";


    document.getElementById(
        "productBrand"
    ).value =
        product.brand || "";


    document.getElementById(
        "productDescription"
    ).value =
        product.description || "";


    document.getElementById(
        "productPrice"
    ).value =
        product.price ?? "";


    document.getElementById(
        "productOldPrice"
    ).value =
        product.oldPrice ?? "";


    document.getElementById(
        "productRating"
    ).value =
        product.rating ?? "";


    document.getElementById(
        "productStock"
    ).value =
        product.stock ?? "";


    document.getElementById(
        "productCategory"
    ).value =
        product.category || "";


    document.getElementById(
        "productImage"
    ).value =
        product.image || "";


    document.getElementById(
        "productFormSection"
    ).style.display =
        "block";

}


// ======================
// SAVE / UPDATE PRODUCT
// ======================

async function saveProduct(event) {

    event.preventDefault();

    // ======================
    // IMAGE UPLOAD
    // ======================

    let imageURL =
        document
            .getElementById("productImage")
            .value
            .trim();


    const imageFile =
        document
            .getElementById("productImageFile")
            .files[0];


    if (imageFile) {

        imageURL =
            await uploadProductImage(
                imageFile
            );


        if (!imageURL) {

            return;

        }

    }
    const productData = {

        name:
            document.getElementById(
                "productName"
            ).value.trim(),

        brand:
            document.getElementById(
                "productBrand"
            ).value.trim(),

        description:
            document.getElementById(
                "productDescription"
            ).value.trim(),

        price:
            Number(
                document.getElementById(
                    "productPrice"
                ).value
            ),

        oldPrice:
            Number(
                document.getElementById(
                    "productOldPrice"
                ).value
            ) || null,

        rating:
            Number(
                document.getElementById(
                    "productRating"
                ).value
            ) || 0,

        image:
            imageURL,

        category:
            document.getElementById(
                "productCategory"
            ).value.trim(),

        stock:
            Number(
                document.getElementById(
                    "productStock"
                ).value
            )

    };


    try {

        let response;


        // ======================
        // UPDATE
        // ======================

        if (editingProductId) {

            response =
                await apiFetch(
                    `/products/${editingProductId}`,
                    {
                        method: "PUT",

                        body:
                            JSON.stringify(
                                productData
                            )
                    }
                );

        }


        // ======================
        // CREATE
        // ======================

        else {

            response =
                await apiFetch(
                    "/products",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(
                                productData
                            )
                    }
                );

        }


        if (!response) {

            showProductMessage(
                "Unable to save product."
            );

            return;

        }


        const responseData =
            await response.json();


        if (!responseData.success) {

            showProductMessage(
                responseData.message ||
                "Unable to save product."
            );

            return;

        }


        showProductMessage(
            editingProductId
                ? "Product updated successfully."
                : "Product created successfully."
        );


        closeProductForm();


        await loadAdminProducts();

    }
    catch (error) {

        console.error(
            "Failed to save product:",
            error
        );

        showProductMessage(
            "Unable to save product."
        );

    }

}


// ======================
// DELETE PRODUCT
// ======================

async function deleteProduct(productId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await apiFetch(
                `/products/${productId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response) {

            showProductMessage(
                "Unable to delete product."
            );

            return;

        }


        const responseData =
            await response.json();


        if (!responseData.success) {

            showProductMessage(
                responseData.message ||
                "Unable to delete product."
            );

            return;

        }


        showProductMessage(
            "Product deleted successfully."
        );


        await loadAdminProducts();

    }
    catch (error) {

        console.error(
            "Failed to delete product:",
            error
        );

        showProductMessage(
            "Unable to delete product."
        );

    }

}


// ======================
// CLOSE FORM
// ======================

function closeProductForm() {

    editingProductId = null;


    document.getElementById(
        "productFormSection"
    ).style.display =
        "none";


    document.getElementById(
        "productForm"
    ).reset();

}


// ======================
// MESSAGE
// ======================

function showProductMessage(message) {

    const messageElement =
        document.getElementById(
            "productMessage"
        );


    if (messageElement) {

        messageElement.textContent =
            message;

    }

}


// ======================
// LOGOUT
// ======================

function logoutAdmin() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "Login.html";

}


// ======================
// INITIALIZE
// ======================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAdminProducts();


        document
            .getElementById(
                "productSearchInput"
            )
            .addEventListener(
                "input",
                searchAdminProducts
            );


        document
            .getElementById(
                "addProductButton"
            )
            .addEventListener(
                "click",
                openAddProductForm
            );


        document
            .getElementById(
                "closeProductFormButton"
            )
            .addEventListener(
                "click",
                closeProductForm
            );


        document
            .getElementById(
                "cancelProductButton"
            )
            .addEventListener(
                "click",
                closeProductForm
            );


        document
            .getElementById(
                "productForm"
            )
            .addEventListener(
                "submit",
                saveProduct
            );


        document
            .getElementById(
                "adminLogoutButton"
            )
            .addEventListener(
                "click",
                logoutAdmin
            );

    }
);