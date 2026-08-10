// ======================
// SIGNUP MODULE
// ======================

const signupForm =
    document.getElementById("signupForm");

const signupMessage =
    document.getElementById("signupMessage");

// ======================
// SHOW / HIDE PASSWORD
// ======================

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");
const confirmPasswordInput =
    document.getElementById("confirmPassword");

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "Hide";

    }
    else {

        passwordInput.type = "password";

        togglePassword.textContent = "Show";

    }

});
toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPasswordInput.type === "password") {

        confirmPasswordInput.type = "text";

        toggleConfirmPassword.textContent = "Hide";

    }
    else {

        confirmPasswordInput.type = "password";

        toggleConfirmPassword.textContent = "Show";

    }

});

// ======================
// PASSWORD STRENGTH
// ======================

const strengthBar =
    document.getElementById("strengthBar");

const strengthText =
    document.getElementById("strengthText");


passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    let strength = 0;


    if (password.length >= 8) {

        strength++;

    }

    if (/[A-Z]/.test(password)) {

        strength++;

    }

    if (/[0-9]/.test(password)) {

        strength++;

    }

    if (/[^A-Za-z0-9]/.test(password)) {

        strength++;

    }


    if (password.length === 0) {

        strengthBar.style.width = "0%";

        strengthText.textContent = "";

        return;

    }


    if (strength <= 1) {

        strengthBar.style.width = "25%";

        strengthText.textContent =
            "Weak password";

    }
    else if (strength === 2) {

        strengthBar.style.width = "50%";

        strengthText.textContent =
            "Medium password";

    }
    else if (strength === 3) {

        strengthBar.style.width = "75%";

        strengthText.textContent =
            "Good password";

    }
    else {

        strengthBar.style.width = "100%";

        strengthText.textContent =
            "Strong password";

    }

});
// ======================
// SIGNUP FORM
// ======================

signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    signupMessage.textContent = "";


    // ======================
    // BASIC VALIDATION
    // ======================

    if (name === "") {

        signupMessage.style.color = "#dc3545";

        signupMessage.textContent =
            "Please enter your name.";

        return;

    }


    if (email === "") {

        signupMessage.style.color = "#dc3545";

        signupMessage.textContent =
            "Please enter your email.";

        return;

    }


    if (password === "") {

        signupMessage.style.color = "#dc3545";

        signupMessage.textContent =
            "Please enter a password.";

        return;

    }
    if (password.length < 8) {

        signupMessage.style.color = "#dc3545";

        signupMessage.textContent =
            "Password must be at least 8 characters.";

        return;

    }


    if (password !== confirmPassword) {

        signupMessage.style.color = "#dc3545";

        signupMessage.textContent =
            "Passwords do not match.";

        return;

    }


    const signupButton =
        document.querySelector(".signup-button");

    signupButton.disabled = true;

    signupButton.textContent =
        "Creating Account...";


    try {

        const response = await fetch(
            "http://localhost:8080/users/register",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    email: email,

                    password: password

                })

            }
        );


        const result =
            await response.json();


        if (!response.ok || !result.success) {

            signupMessage.style.color =
                "#dc3545";

            signupMessage.textContent =
                result.message ||
                "Unable to create account.";

            return;

        }


        // ======================
        // SUCCESS
        // ======================

        signupMessage.style.color =
            "#198754";

        signupMessage.textContent =
            "Account created successfully. Redirecting to login...";


        setTimeout(() => {

            window.location.href =
                "Login.html";

        }, 1200);


    }
    catch (error) {

        console.error(error);

        signupMessage.style.color =
            "#dc3545";

        signupMessage.textContent =
            "Unable to connect to server.";

    }
    finally {

        signupButton.disabled = false;

        signupButton.textContent =
            "Create Account";

    }

});