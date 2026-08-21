// ======================
// PRODUCT FEEDBACK
// ======================


// ======================
// LOAD FEEDBACK
// ======================

async function loadFeedback() {

    const feedbackList =
        document.getElementById("feedbackList");

    if (!feedbackList || !productId) {
        return;
    }

    try {

        const response =
            await apiFetch(
                `/feedback/products/${productId}`
            );

        if (!response) {
            return;
        }

        const responseData =
            await response.json();


        if (!responseData.success) {

            feedbackList.innerHTML = `
                <p class="feedback-error">
                    Failed to load feedback.
                </p>
            `;

            return;
        }


        const feedback =
            responseData.data || [];


        renderFeedback(feedback);

        renderFeedbackForm();

    }
    catch (error) {

        console.error(
            "Failed to load feedback:",
            error
        );

    }

}


// ======================
// RENDER FEEDBACK
// ======================

function renderFeedback(feedbackList) {

    const container =
        document.getElementById("feedbackList");

    if (!container) {
        return;
    }


    if (feedbackList.length === 0) {

        container.innerHTML = `
            <div class="no-feedback">

                <p>
                    No feedback yet.
                </p>

                <span>
                    Be the first customer to share your experience.
                </span>

            </div>
        `;

        return;
    }


    // ======================
    // CURRENT USER
    // ======================

    let currentUser = null;

    const userData =
        localStorage.getItem("user");

    if (userData) {

        try {

            currentUser =
                JSON.parse(userData);

        }
        catch (error) {

            console.error(
                "Failed to read current user:",
                error
            );

        }

    }


    container.innerHTML = `

        <div class="feedback-count">

            ${feedbackList.length}
            Customer
            ${feedbackList.length > 1 ? "Reviews" : "Review"}

        </div>


        ${feedbackList.map(function (feedback) {

        const isOwner =
            currentUser &&
            Number(feedback.userId) ===
            Number(currentUser.id);

        const isAdmin =
            currentUser &&
            currentUser.role === "ADMIN";


        return `

                <div
                    class="feedback-card"
                    data-feedback-id="${feedback.id}"
                >

                    <!-- ======================
                         USER
                    ======================= -->

                    <div class="feedback-user">

                        <span class="feedback-user-icon">
                            👤
                        </span>

                        <strong>
                            ${escapeFeedbackHTML(
            feedback.userName
        )}
                        </strong>

                    </div>


                    <!-- ======================
                         COMMENT
                    ======================= -->

                    <p class="feedback-comment">

                        ${escapeFeedbackHTML(
            feedback.comment
        )}

                    </p>


                    <!-- ======================
                         DATE
                    ======================= -->

                    <small class="feedback-date">

                        ${formatFeedbackDate(
            feedback.createdAt
        )}

                    </small>


                    ${isOwner
                ? `
        <div class="feedback-actions">

            <button
                type="button"
                class="feedback-edit-button"
                data-feedback-id="${feedback.id}">

                ✏️ Edit

            </button>

            <button
                type="button"
                class="feedback-delete-button"
                data-feedback-id="${feedback.id}">

                🗑️ Delete

            </button>

        </div>
        `

                : isAdmin
                    ? `
            <div class="feedback-actions">

                <button
                    type="button"
                    class="feedback-delete-button"
                    data-feedback-id="${feedback.id}">

                    🗑️ Delete

                </button>

            </div>
            `
                    : ""
            }

                </div>

            `;

    }).join("")}

    `;

}


// ======================
// FEEDBACK FORM
// ======================

function renderFeedbackForm() {

    const container =
        document.getElementById(
            "feedbackFormContainer"
        );

    if (!container) {
        return;
    }


    const token =
        localStorage.getItem("token");


    // ======================
    // NOT LOGGED IN
    // ======================

    if (!token) {

        container.innerHTML = `

            <div class="feedback-login-message">

                🔐

                <span>
                    Login to write a review.
                </span>

                <button
                    type="button"
                    id="feedbackLoginButton">

                    Login

                </button>

            </div>

        `;


        const loginButton =
            document.getElementById(
                "feedbackLoginButton"
            );


        if (loginButton) {

            loginButton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "Login.html";

                }
            );

        }

        return;
    }


    // ======================
    // LOGGED IN
    // ======================

    container.innerHTML = `

        <div class="feedback-form">

            <h3>
                Write a Review
            </h3>


            <textarea
                id="feedbackComment"
                placeholder="Share your experience with this product..."
                maxlength="1000"
            ></textarea>


            <div
                id="feedbackMessage"
                class="feedback-message">
            </div>


            <button
                type="button"
                id="submitFeedbackButton">

                Submit Feedback

            </button>

        </div>

    `;


    const submitButton =
        document.getElementById(
            "submitFeedbackButton"
        );


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            submitFeedback
        );

    }

}


// ======================
// SUBMIT FEEDBACK
// ======================

async function submitFeedback() {

    const commentInput =
        document.getElementById(
            "feedbackComment"
        );

    const message =
        document.getElementById(
            "feedbackMessage"
        );


    if (!commentInput || !message) {
        return;
    }


    const comment =
        commentInput.value.trim();


    // ======================
    // EMPTY CHECK
    // ======================

    if (!comment) {

        message.textContent =
            "Please write your feedback.";

        message.className =
            "feedback-message error";

        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "Login.html";

        return;
    }


    try {

        const response =
            await apiFetch(
                `/feedback/products/${productId}`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        comment: comment
                    })
                }
            );


        if (!response) {
            return;
        }


        const responseData =
            await response.json();


        if (!response.ok ||
            !responseData.success) {

            message.textContent =
                responseData.message ||
                "Failed to submit feedback.";

            message.className =
                "feedback-message error";

            return;
        }


        // ======================
        // SUCCESS
        // ======================

        message.textContent =
            "Feedback submitted successfully.";

        message.className =
            "feedback-message success";


        commentInput.value = "";


        // Reload feedback

        await loadFeedback();

    }
    catch (error) {

        console.error(
            "Feedback submission failed:",
            error
        );


        message.textContent =
            "Something went wrong. Please try again.";

        message.className =
            "feedback-message error";

    }

}


// ======================
// EDIT FEEDBACK
// ======================

async function editFeedback(feedbackId) {

    const card =
        document.querySelector(
            `.feedback-card[data-feedback-id="${feedbackId}"]`
        );

    if (!card) {
        return;
    }


    const commentElement =
        card.querySelector(".feedback-comment");

    const actions =
        card.querySelector(".feedback-actions");


    if (!commentElement || !actions) {
        return;
    }


    const oldComment =
        commentElement.textContent.trim();


    // ======================
    // PREVENT DUPLICATE EDIT
    // ======================

    if (card.querySelector(".feedback-edit-area")) {
        return;
    }


    // ======================
    // EDIT AREA
    // ======================

    const editArea =
        document.createElement("div");

    editArea.className =
        "feedback-edit-area";


    editArea.innerHTML = `

        <textarea
            class="feedback-edit-input"
            maxlength="1000"
        ></textarea>

        <div class="feedback-edit-actions">

            <button
                type="button"
                class="feedback-save-button">

                Save

            </button>

            <button
                type="button"
                class="feedback-cancel-button">

                Cancel

            </button>

        </div>

        <div
            class="feedback-edit-message">
        </div>

    `;


    editArea
        .querySelector(".feedback-edit-input")
        .value =
        oldComment;


    commentElement.style.display =
        "none";

    actions.style.display =
        "none";


    commentElement
        .parentNode
        .insertBefore(
            editArea,
            commentElement.nextSibling
        );


    // ======================
    // SAVE
    // ======================

    const saveButton =
        editArea.querySelector(
            ".feedback-save-button"
        );


    saveButton.addEventListener(
        "click",
        async function () {

            await updateFeedback(
                feedbackId,
                editArea
            );

        }
    );


    // ======================
    // CANCEL
    // ======================

    const cancelButton =
        editArea.querySelector(
            ".feedback-cancel-button"
        );


    cancelButton.addEventListener(
        "click",
        function () {

            editArea.remove();

            commentElement.style.display =
                "";

            actions.style.display =
                "";

        }
    );

}


// ======================
// UPDATE FEEDBACK
// ======================

async function updateFeedback(
    feedbackId,
    editArea
) {

    const input =
        editArea.querySelector(
            ".feedback-edit-input"
        );

    const message =
        editArea.querySelector(
            ".feedback-edit-message"
        );


    if (!input || !message) {
        return;
    }


    const comment =
        input.value.trim();


    // ======================
    // EMPTY CHECK
    // ======================

    if (!comment) {

        message.textContent =
            "Feedback cannot be empty.";

        message.className =
            "feedback-edit-message error";

        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "Login.html";

        return;
    }


    try {

        const response =
            await apiFetch(
                `/feedback/${feedbackId}`,
                {
                    method: "PUT",

                    body: JSON.stringify({
                        comment: comment
                    })
                }
            );


        if (!response) {
            return;
        }


        const responseData =
            await response.json();


        if (!response.ok ||
            !responseData.success) {

            message.textContent =
                responseData.message ||
                "Failed to update feedback.";

            message.className =
                "feedback-edit-message error";

            return;
        }


        // ======================
        // SUCCESS
        // ======================

        await loadFeedback();

    }
    catch (error) {

        console.error(
            "Feedback update failed:",
            error
        );


        message.textContent =
            "Something went wrong. Please try again.";

        message.className =
            "feedback-edit-message error";

    }

}


// ======================
// DELETE FEEDBACK
// ======================

async function deleteFeedback(feedbackId) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this feedback?"
        );


    if (!confirmed) {
        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        window.location.href =
            "Login.html";

        return;
    }


    try {

        const response =
            await apiFetch(
                `/feedback/${feedbackId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response) {
            return;
        }


        const responseData =
            await response.json();


        if (!response.ok ||
            !responseData.success) {

            alert(
                responseData.message ||
                "Failed to delete feedback."
            );

            return;
        }


        // ======================
        // SUCCESS
        // ======================

        await loadFeedback();

    }
    catch (error) {

        console.error(
            "Feedback deletion failed:",
            error
        );


        alert(
            "Something went wrong. Please try again."
        );

    }

}


// ======================
// FEEDBACK ACTION EVENTS
// ======================

document.addEventListener(
    "click",
    function (event) {

        // ======================
        // EDIT
        // ======================

        const editButton =
            event.target.closest(
                ".feedback-edit-button"
            );


        if (editButton) {

            const feedbackId =
                editButton.dataset.feedbackId;


            editFeedback(
                feedbackId
            );

            return;

        }


        // ======================
        // DELETE
        // ======================

        const deleteButton =
            event.target.closest(
                ".feedback-delete-button"
            );


        if (deleteButton) {

            const feedbackId =
                deleteButton.dataset.feedbackId;


            deleteFeedback(
                feedbackId
            );

        }

    }
);


// ======================
// ESCAPE HTML
// ======================

function escapeFeedbackHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================
// FORMAT DATE
// ======================

function formatFeedbackDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    return date.toLocaleString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );

}


// ======================
// START FEEDBACK
// ======================

loadFeedback();