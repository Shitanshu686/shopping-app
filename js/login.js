// ======================
// LOGIN MODULE
// ======================

const loginForm =
    document.getElementById("loginForm");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const loginMessage =
    document.getElementById("loginMessage");


// ======================
// SHOW / HIDE PASSWORD
// ======================

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

// ======================
// LOGIN FORM
// ======================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        passwordInput.value;


    loginMessage.textContent = "";


    if (email === "") {

        loginMessage.style.color = "#dc3545";

        loginMessage.textContent =
            "Please enter your email.";

        return;

    }


    if (password === "") {

        loginMessage.style.color = "#dc3545";

        loginMessage.textContent =
            "Please enter your password.";

        return;

    }


    const loginButton =
        document.querySelector(".login-button");

    loginButton.disabled = true;

    loginButton.textContent = "Logging in...";


    try {

        const response = await fetch(
            "http://localhost:8080/users/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const result = await response.json();


        if (!response.ok || !result.success) {

            loginMessage.style.color = "#dc3545";

            loginMessage.textContent =
                result.message || "Invalid Email or Password";

            return;

        }


        // ======================
        // LOGIN SUCCESS
        // ======================

        const token = result.data.token;

        const user = result.data.user;


        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        loginMessage.style.color = "#198754";

        loginMessage.textContent =
            "Login successful. Redirecting...";


        setTimeout(() => {

            window.location.href = "Shopping.html";

        }, 800);


    }
    catch (error) {

        console.error(error);

        loginMessage.style.color = "#dc3545";

        loginMessage.textContent =
            "Unable to connect to server.";

    }
    finally {

        loginButton.disabled = false;

        loginButton.textContent = "Login";

    }

});