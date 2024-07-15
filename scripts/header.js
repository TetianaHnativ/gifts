import { waitForElement } from "./functions.js";

async function isUserAuthorized() {
    try {
        const loginLink = await waitForElement(".login-link");

        let myUser = parseInt(localStorage.getItem("user")) || 0;

        if (myUser) {
            loginLink.textContent = "Кабінет";
            loginLink.href = "myAccount.html";
        } else {
            loginLink.textContent = "Login";
            loginLink.href = "authorization.html";
        }
    } catch (error) {
        console.error(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    isUserAuthorized();
});