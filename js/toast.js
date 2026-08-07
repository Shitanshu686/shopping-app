// ======================
// TOAST MODULE
// ======================

function showToast(message) {

    let toast = document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2000);
}