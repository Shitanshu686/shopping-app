// ======================
// APPLICATION MENU
// ======================

const applicationMenuButton =
    document.getElementById("applicationMenuButton");

const applicationSidebar =
    document.getElementById("applicationSidebar");

const closeApplicationMenu =
    document.getElementById("closeApplicationMenu");


// ======================
// OPEN MENU
// ======================

if (applicationMenuButton) {

    applicationMenuButton.addEventListener(
        "click",
        function () {

            applicationSidebar.classList.add("show");

        }
    );

}


// ======================
// CLOSE MENU
// ======================

if (closeApplicationMenu) {

    closeApplicationMenu.addEventListener(
        "click",
        function () {

            applicationSidebar.classList.remove("show");

        }
    );

}
// ======================
// APPLICATION LOGOUT VISIBILITY
// ======================

const applicationLogoutButton =
    document.getElementById("applicationLogoutButton");

function updateApplicationLogoutVisibility() {

    if (!applicationLogoutButton) {
        return;
    }

    const token = localStorage.getItem("token");

    if (token) {

        applicationLogoutButton.style.display = "flex";

    } else {

        applicationLogoutButton.style.display = "none";

    }

}


// Run when page loads
updateApplicationLogoutVisibility();

// ======================
// SIDEBAR LOGOUT
// ======================

if (applicationLogoutButton) {

    applicationLogoutButton.addEventListener(
        "click",
        logoutUser
    );

}