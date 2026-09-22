// ShopEase Global Header Component
(function () {
    // 1. Ensure original header.css is linked
    if (!document.querySelector('link[href*="header.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "css/header.css";
        document.head.appendChild(link);
    }

    // 2. Check current page: agar login page hai toh logout button mat dikhao
    const currentPage = window.location.pathname.split("/").pop().toLowerCase();
    const isLoginPage = currentPage === "login.html" || currentPage === "login";

    const navContent = isLoginPage 
        ? '<a href="Shopping.html">Home </a>'
        : '<a href="Shopping.html">Home </a><button id="adminLogoutButton">Logout </button>';

    const adminHeaderHtml = `
    <header>
        <div class="container navbar">
            <div class="logo-section"><img src="images/logo.png" class="logo" alt="ShopEase Logo">
                <h1>ShopEase Admin</h1>
            </div>
            <nav>${navContent}</nav>
        </div>
    </header>
    `;

    // 3. Exact project logoutAdmin function
    function logoutAdmin() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "Login.html";
    }

    function injectHeader() {
        const target = document.getElementById("app-header");
        if (target) {
            target.innerHTML = adminHeaderHtml;

            const logoutBtn = document.getElementById("adminLogoutButton");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", logoutAdmin);
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectHeader);
    } else {
        injectHeader();
    }
})();
