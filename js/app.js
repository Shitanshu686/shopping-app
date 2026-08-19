// ======================
// AUTHENTICATION STATE
// ======================

const loginLink =
    document.getElementById("loginLink");

const profileDropdown =
    document.getElementById("profileDropdown");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileRole =
    document.getElementById("profileRole");

const logoutButton =
    document.getElementById("logoutButton");

const myOrdersButton =
    document.getElementById("myOrdersButton");



const token =
    localStorage.getItem("token");

const userData =
    localStorage.getItem("user");


// ======================
// CHECK LOGIN STATE
// ======================

if (token && userData) {

    const user =
        JSON.parse(userData);


    // ======================
    // SHOW USERNAME
    // ======================

    loginLink.textContent =
        `👤 ${user.name}`;

    loginLink.removeAttribute("href");


    // ======================
    // PROFILE DETAILS
    // ======================

    profileName.textContent =
        user.name;

    profileEmail.textContent =
        user.email;

    profileRole.textContent =
        user.role;


    // ======================
    // ADMIN PANEL
    // ======================

    const adminPanelButton =
        document.getElementById("adminPanelButton");


    if (user.role === "ADMIN") {

        adminPanelButton.style.display =
            "block";

    }
    else {

        adminPanelButton.style.display =
            "none";

    }


    // ======================
    // MY ORDERS
    // ======================

    if (myOrdersButton) {

        myOrdersButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "OrderHistory.html";

            }
        );

    }


    // ======================
    // SHOW / HIDE PROFILE
    // ======================

    loginLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            profileDropdown.classList.toggle(
                "show"
            );

        }
    );

    if (changePasswordButton) {

        changePasswordButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "ChangePassword.html";

            }
        );

    }
    // ======================
    // LOGOUT
    // ======================

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "Login.html";

        }
    );

}
else {

    // ======================
    // USER NOT LOGGED IN
    // ======================

    profileDropdown.style.display =
        "none";


    loginLink.addEventListener(
        "click",
        function () {

            window.location.href =
                "Login.html";

        }
    );

}


// ======================
// APPLICATION START
// ======================

loadProducts();