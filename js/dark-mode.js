// ======================
// DARK MODE
// ======================

const darkModeToggle =
    document.getElementById("darkModeToggle");


// ======================
// APPLY THEME
// ======================

function applyDarkMode(isDarkMode) {

    if (isDarkMode) {

        document.body.classList.add("dark-mode");

    }
    else {

        document.body.classList.remove("dark-mode");

    }

    if (darkModeToggle) {

        darkModeToggle.checked =
            isDarkMode;

    }

}


// ======================
// LOAD USER PREFERENCE
// ======================

function loadDarkModePreference() {

    const userData =
        localStorage.getItem("user");

    if (!userData) {

        // Logged out = Light Mode
        applyDarkMode(false);

        return;

    }

    const user =
        JSON.parse(userData);

    applyDarkMode(
        user.darkMode === true
    );

}


// ======================
// UPDATE BACKEND
// ======================

async function updateDarkModePreference(
    darkMode
) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        return;

    }

    try {

        const response =
            await fetch(
                "http://localhost:8080/users/preferences/dark-mode",
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token

                    },

                    body: JSON.stringify({

                        darkMode: darkMode

                    })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            console.error(
                "Failed to update dark mode:",
                result
            );

            return;

        }


        // ======================
        // UPDATE LOCAL USER DATA
        // ======================

        const userData =
            localStorage.getItem("user");

        if (userData) {

            const user =
                JSON.parse(userData);

            user.darkMode =
                darkMode;

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

        }

    }
    catch (error) {

        console.error(
            "Dark mode update error:",
            error
        );

    }

}


// ======================
// TOGGLE EVENT
// ======================

if (darkModeToggle) {

    darkModeToggle.addEventListener(
        "change",
        function () {

            const isDarkMode =
                darkModeToggle.checked;


            // Apply immediately
            applyDarkMode(
                isDarkMode
            );


            // Save to backend
            updateDarkModePreference(
                isDarkMode
            );

        }
    );

}


// ======================
// INITIALIZE
// ======================

loadDarkModePreference();