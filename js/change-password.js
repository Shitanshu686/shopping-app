// ======================
// CHANGE PASSWORD
// ======================


// ======================
// GET FORM
// ======================

const changePasswordForm =
    document.getElementById("changePasswordForm");

const changePasswordButton =
    document.getElementById("changePasswordButton");

const passwordMessage =
    document.getElementById("passwordMessage");


// ======================
// SHOW MESSAGE
// ======================

function showPasswordMessage(
    message,
    success = false
) {

    passwordMessage.textContent =
        message;

    if (success) {

        passwordMessage.style.color =
            "green";

    }
    else {

        passwordMessage.style.color =
            "red";

    }

}


// ======================
// CHANGE PASSWORD
// ======================

async function handleChangePassword(event) {

    event.preventDefault();


    // ======================
    // GET VALUES
    // ======================

    const currentPassword =
        document
            .getElementById("currentPassword")
            .value
            .trim();

    const newPassword =
        document
            .getElementById("newPassword")
            .value
            .trim();

    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value
            .trim();


    // ======================
    // CLEAR MESSAGE
    // ======================

    showPasswordMessage("");


    // ======================
    // FRONTEND VALIDATION
    // ======================

    if (!currentPassword) {

        showPasswordMessage(
            "Current password is required"
        );

        return;

    }


    if (!newPassword) {

        showPasswordMessage(
            "New password is required"
        );

        return;

    }


    if (newPassword.length < 8) {

        showPasswordMessage(
            "New password must be at least 8 characters"
        );

        return;

    }


    if (!confirmPassword) {

        showPasswordMessage(
            "Confirm password is required"
        );

        return;

    }


    if (newPassword !== confirmPassword) {

        showPasswordMessage(
            "New password and confirm password do not match"
        );

        return;

    }


    // ======================
    // BUTTON STATE
    // ======================

    changePasswordButton.disabled =
        true;

    changePasswordButton.textContent =
        "Changing Password...";


    // ======================
    // REQUEST BODY
    // ======================

    const passwordData = {

        currentPassword:
            currentPassword,

        newPassword:
            newPassword,

        confirmPassword:
            confirmPassword

    };


    // ======================
    // API CALL
    // ======================

    try {

        const response =
            await apiFetch(
                "/users/change-password",
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            passwordData
                        )

                }
            );


        // ======================
        // SUCCESS
        // ======================

        showPasswordMessage(
            "Password changed successfully",
            true
        );


        // ======================
        // CLEAR FORM
        // ======================

        changePasswordForm.reset();


        // ======================
        // REDIRECT
        // ======================

        setTimeout(function () {

            window.location.href =
                "Shopping.html";

        }, 1500);


    }
    catch (error) {

        console.error(
            "Change password failed:",
            error
        );


        // ======================
        // ERROR MESSAGE
        // ======================

        if (
            error &&
            error.message
        ) {

            showPasswordMessage(
                error.message
            );

        }
        else {

            showPasswordMessage(
                "Unable to change password"
            );

        }

    }
    finally {

        changePasswordButton.disabled =
            false;

        changePasswordButton.textContent =
            "Change Password";

    }

}


// ======================
// BACK TO SHOPPING
// ======================

function goBack() {

    window.location.href =
        "Shopping.html";

}


// ======================
// FORM EVENT
// ======================

if (changePasswordForm) {

    changePasswordForm.addEventListener(
        "submit",
        handleChangePassword
    );

}