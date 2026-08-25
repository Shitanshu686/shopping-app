// ======================
// ADMIN USERS MODULE
// ======================


// ======================
// USERS DATA
// ======================

let users = [];


// ======================
// FETCH USERS
// ======================

async function fetchAdminUsers() {

    const response =
        await apiFetch("/users/admin");


    if (!response) {

        showUserMessage(
            "Unable to load users."
        );

        return;

    }


    const responseData =
        await response.json();


    if (!responseData.success) {

        showUserMessage(
            responseData.message ||
            "Unable to load users."
        );

        return;

    }


    users =
        responseData.data || [];


    renderUsers(users);
    hideSelfRoleButton();

}


// ======================
// RENDER USERS
// ======================

function renderUsers(userList) {

    const tableBody =
        document.getElementById(
            "userTableBody"
        );


    tableBody.innerHTML = "";


    if (!userList.length) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="6">
                    No users found.
                </td>

            </tr>

        `;

        return;

    }


    userList.forEach(user => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${user.id}
            </td>

            <td>
                ${user.name}
            </td>

            <td>
                ${user.email}
            </td>

            <td>

                <span class="user-role ${user.role.toLowerCase()}">

                    ${user.role}

                </span>

            </td>

            <td>

                ${user.darkMode
                ? "ON"
                : "OFF"
            }

            </td>

            <td>

                <button
                    class="view-user-button"
                    onclick="viewUser(${user.id})">

                    View

                </button>
<button
    class="change-role-button"
    onclick="changeUserRole(${user.id}, '${user.role}')">

    Change Role

</button>
<button
    class="delete-user-button"
    onclick="deleteUser(${user.id})">

    Delete

</button>
            </td>
            

        `;


        tableBody.appendChild(row);

    });

}


// ======================
// SEARCH USERS
// ======================

function searchAdminUsers() {

    const searchValue =
        document
            .getElementById(
                "userSearchInput"
            )
            .value
            .toLowerCase()
            .trim();


    const filteredUsers =
        users.filter(user => {

            return (

                user.name
                    .toLowerCase()
                    .includes(searchValue)

                ||

                user.email
                    .toLowerCase()
                    .includes(searchValue)

            );

        });


    renderUsers(
        filteredUsers
    );

}


// ======================
// VIEW USER
// ======================

async function viewUser(userId) {

    const response =
        await apiFetch(
            `/users/admin/${userId}`
        );


    if (!response) {

        showUserMessage(
            "Unable to fetch user details."
        );

        return;

    }


    const responseData =
        await response.json();


    if (!responseData.success) {

        showUserMessage(
            responseData.message ||
            "Unable to fetch user details."
        );

        return;

    }


    const user =
        responseData.data;


    alert(

        `User Details\n\n` +

        `ID: ${user.id}\n` +

        `Name: ${user.name}\n` +

        `Email: ${user.email}\n` +

        `Role: ${user.role}\n` +

        `Dark Mode: ${user.darkMode
            ? "ON"
            : "OFF"
        }`

    );

}


// ======================
// SHOW MESSAGE
// ======================

function showUserMessage(message) {

    const messageElement =
        document.getElementById(
            "userManagementMessage"
        );


    if (!messageElement) {

        return;

    }


    messageElement.textContent =
        message;

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

function initializeAdminUsers() {

    const searchInput =
        document.getElementById(
            "userSearchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchAdminUsers
        );

    }


    const logoutButton =
        document.getElementById(
            "adminLogoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logoutAdmin
        );

    }


    fetchAdminUsers();

}


// ======================
// START
// ======================

initializeAdminUsers();

async function changeUserRole(userId, currentRole) {

    const newRole =
        currentRole === "USER"
            ? "ADMIN"
            : "USER";

    const confirmed =
        confirm(
            `Change role from ${currentRole} to ${newRole}?`
        );

    if (!confirmed) {
        return;
    }

    const response =
        await apiFetch(
            `/users/admin/${userId}/role?role=${newRole}`,
            {
                method: "PUT"
            }
        );

    if (!response) {

        showUserMessage(
            "Unable to update user role."
        );

        return;
    }

    const responseData =
        await response.json();

    if (!responseData.success) {

        showUserMessage(
            responseData.message ||
            "Unable to update user role."
        );

        return;
    }

    showUserMessage(
        "User role updated successfully."
    );

    await fetchAdminUsers();
}

function getLoggedInAdminEmail() {

    const userData =
        localStorage.getItem("user");

    if (!userData) {
        return null;
    }

    try {

        const user =
            JSON.parse(userData);

        return user.email;

    } catch (error) {

        return null;

    }
}
function hideSelfRoleButton() {

    const adminEmail =
        getLoggedInAdminEmail();

    if (!adminEmail) {
        return;
    }

    const rows =
        document.querySelectorAll(
            "#userTableBody tr"
        );

    rows.forEach(row => {

        const emailCell =
            row.children[2];

        if (!emailCell) {
            return;
        }

        if (
            emailCell.textContent
                .trim()
                .toLowerCase() ===
            adminEmail.toLowerCase()
        ) {

            const roleButton =
                row.querySelector(
                    ".change-role-button"
                );

            if (roleButton) {
                roleButton.remove();
            }
            const deleteButton =
                row.querySelector(
                    ".delete-user-button"
                );

            if (deleteButton) {
                deleteButton.remove();
            }

        }

    });

}
// ======================
// DELETE USER
// ======================

async function deleteUser(userId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this user?"
        );

    if (!confirmed) {
        return;
    }


    const response =
        await apiFetch(
            `/users/admin/${userId}`,
            {
                method: "DELETE"
            }
        );


    if (!response) {

        showUserMessage(
            "Unable to delete user."
        );

        return;
    }


    const responseData =
        await response.json();


    if (!responseData.success) {

        showUserMessage(
            responseData.message ||
            "Unable to delete user."
        );

        return;
    }


    showUserMessage(
        "User deleted successfully."
    );


    await fetchAdminUsers();

}