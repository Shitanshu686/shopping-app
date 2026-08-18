// ======================
// CHECKOUT
// ======================


// ======================
// PLACE ORDER
// ======================

async function handleCheckout(event) {

    event.preventDefault();


    // ======================
    // GET FORM VALUES
    // ======================

    const fullName =
        document.getElementById("fullName").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const city =
        document.getElementById("city").value.trim();

    const state =
        document.getElementById("state").value.trim();

    const pincode =
        document.getElementById("pincode").value.trim();


    // ======================
    // BUILD ORDER REQUEST
    // ======================

    const orderData = {

        shippingAddress: {

            fullName: fullName,

            phone: phone,

            address: address,

            city: city,

            state: state,

            pincode: pincode

        }

    };


    // ======================
    // PLACE ORDER BUTTON
    // ======================

    const placeOrderBtn =
        document.getElementById("placeOrderBtn");


    if (placeOrderBtn) {

        placeOrderBtn.disabled = true;

        placeOrderBtn.textContent =
            "Placing Order...";

    }


    // ======================
    // PLACE ORDER
    // ======================

    try {

        const order =
            await placeOrder(orderData);


        // ======================
        // ORDER FAILED
        // ======================

        if (!order) {

            alert(
                "Unable to place order"
            );

            if (placeOrderBtn) {

                placeOrderBtn.disabled = false;

                placeOrderBtn.textContent =
                    "Place Order";

            }

            return;

        }


        // ======================
        // GET ORDER ID
        // ======================

        const orderId =
            order.orderId;


        if (!orderId) {

            console.error(
                "Order ID missing from response:",
                order
            );

            alert(
                "Order placed, but order ID was not received."
            );

            if (placeOrderBtn) {

                placeOrderBtn.disabled = false;

                placeOrderBtn.textContent =
                    "Place Order";

            }

            return;

        }


        // ======================
        // ORDER SUCCESS
        // ======================

        console.log(
            "Order placed successfully:",
            order
        );


        // ======================
        // REDIRECT
        // ======================

        window.location.href =
            `OrderSuccess.html?id=${orderId}`;

    }
    catch (error) {

        console.error(
            "Checkout failed:",
            error
        );


        alert(
            "Unable to place order"
        );


        if (placeOrderBtn) {

            placeOrderBtn.disabled = false;

            placeOrderBtn.textContent =
                "Place Order";

        }

    }

}


// ======================
// INITIALIZE CHECKOUT
// ======================

function initializeCheckout() {

    const checkoutForm =
        document.getElementById("checkoutForm");


    if (!checkoutForm) {

        return;

    }


    checkoutForm.addEventListener(
        "submit",
        handleCheckout
    );

}


// ======================
// START
// ======================

initializeCheckout();