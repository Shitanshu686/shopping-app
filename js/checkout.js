// ======================
// CHECKOUT MODULE
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
        document.getElementById("fullName")
            .value
            .trim();

    const phone =
        document.getElementById("phone")
            .value
            .trim();

    const address =
        document.getElementById("address")
            .value
            .trim();

    const city =
        document.getElementById("city")
            .value
            .trim();

    const state =
        document.getElementById("state")
            .value
            .trim();

    const pincode =
        document.getElementById("pincode")
            .value
            .trim();


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
    // BUTTON
    // ======================

    const placeOrderBtn =
        document.getElementById(
            "placeOrderBtn"
        );


    if (placeOrderBtn) {

        placeOrderBtn.disabled = true;

        placeOrderBtn.textContent =
            "Creating Order...";

    }


    // ======================
    // CREATE ORDER
    // ======================

    try {

        const order =
            await placeOrder(orderData);


        if (!order) {

            showCheckoutError(
                "Unable to place order."
            );

            return;

        }


        // ======================
        // GET ORDER ID
        // ======================

        const orderId =
            order.orderId;


        const amount =
            order.totalAmount;


        if (!orderId) {

            console.error(
                "Order ID missing:",
                order
            );

            showCheckoutError(
                "Order created but Order ID was not received."
            );

            return;

        }


        if (amount === undefined ||
            amount === null) {

            console.error(
                "Order amount missing:",
                order
            );

            showCheckoutError(
                "Order amount was not received."
            );

            return;

        }


        console.log(
            "Order created:",
            order
        );


        // ======================
        // CREATE PAYMENT ORDER
        // ======================

        if (placeOrderBtn) {

            placeOrderBtn.textContent =
                "Opening Payment...";

        }


        const paymentOrder =
            await createPaymentOrder(
                orderId,
                amount
            );


        if (!paymentOrder) {

            showCheckoutError(
                "Unable to create payment order."
            );

            return;

        }


        console.log(
            "Payment order created:",
            paymentOrder
        );


        // ======================
        // OPEN RAZORPAY
        // ======================

        openRazorpayCheckout(
            orderId,
            amount,
            paymentOrder.razorpayOrderId
        );


    }
    catch (error) {

        console.error(
            "Checkout failed:",
            error
        );

        showCheckoutError(
            "Unable to place order."
        );

    }

}


// ======================
// OPEN RAZORPAY CHECKOUT
// ======================

function openRazorpayCheckout(
    orderId,
    amount,
    razorpayOrderId
) {


    const options = {

        // ======================
        // RAZORPAY TEST KEY
        // ======================

        key:
            RAZORPAY_KEY_ID,


        // ======================
        // AMOUNT
        // ======================

        amount:
            Math.round(amount * 100),


        currency:
            "INR",


        name:
            "ShopEase",


        description:
            "ShopEase Order Payment",


        order_id:
            razorpayOrderId,


        // ======================
        // PAYMENT SUCCESS
        // ======================

        handler:
            async function (response) {

                console.log(
                    "Razorpay Payment Response:",
                    response
                );


                await handlePaymentSuccess(
                    orderId,
                    response
                );

            },


        // ======================
        // PREFILL
        // ======================

        prefill: {

            name:
                document
                    .getElementById("fullName")
                    .value
                    .trim(),

            contact:
                document
                    .getElementById("phone")
                    .value
                    .trim()

        },


        // ======================
        // THEME
        // ======================

        theme: {

            color:
                "#3399cc"

        }

    };


    const razorpay =
        new Razorpay(options);


    // ======================
    // PAYMENT FAILED
    // ======================

    razorpay.on(
        "payment.failed",
        async function (response) {

            console.error(
                "Payment failed:",
                response
            );


            // =========================
            // MARK PAYMENT AS FAILED
            // =========================

            try {

                const razorpayOrderId =
                    response.error
                        ?.metadata
                        ?.order_id;


                if (razorpayOrderId) {

                    const failureResponse =
                        await markPaymentAsFailed(
                            razorpayOrderId
                        );


                    console.log(
                        "Payment failure recorded:",
                        failureResponse
                    );

                }
                else {

                    console.error(
                        "Razorpay Order ID missing from failure response:",
                        response
                    );

                }

            }
            catch (error) {

                console.error(
                    "Failed to record payment failure:",
                    error
                );

            }


            // =========================
            // SHOW ERROR
            // =========================

            showCheckoutError(
                "Payment failed. Please try again."
            );


            resetPlaceOrderButton();

        }
    );


    razorpay.open();

}


// ======================
// PAYMENT SUCCESS
// ======================

async function handlePaymentSuccess(
    orderId,
    paymentResponse
) {

    try {

        const verificationResponse =
            await verifyPayment(

                paymentResponse
                    .razorpay_order_id,

                paymentResponse
                    .razorpay_payment_id,

                paymentResponse
                    .razorpay_signature

            );


        // ======================
        // VERIFICATION FAILED
        // ======================

        if (!verificationResponse ||
            !verificationResponse.success) {

            console.error(
                "Payment verification failed:",
                verificationResponse
            );


            showCheckoutError(
                "Payment verification failed."
            );


            resetPlaceOrderButton();

            return;

        }


        // ======================
        // PAYMENT SUCCESS
        // ======================

        console.log(
            "Payment verified successfully:",
            verificationResponse
        );


        window.location.href =
            `OrderSuccess.html?id=${orderId}`;

    }
    catch (error) {

        console.error(
            "Payment verification error:",
            error
        );


        showCheckoutError(
            "Unable to verify payment."
        );


        resetPlaceOrderButton();

    }

}


// ======================
// RESET BUTTON
// ======================

function resetPlaceOrderButton() {

    const button =
        document.getElementById(
            "placeOrderBtn"
        );


    if (button) {

        button.disabled = false;

        button.textContent =
            "Place Order";

    }

}


// ======================
// ERROR HANDLING
// ======================

function showCheckoutError(
    message
) {

    alert(message);

    resetPlaceOrderButton();

}


// ======================
// INITIALIZE CHECKOUT
// ======================

function initializeCheckout() {

    const checkoutForm =
        document.getElementById(
            "checkoutForm"
        );


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