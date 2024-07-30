import { loadHTMLWithoutHeader } from "./pageLoader.js";

loadHTMLWithoutHeader();

import { gaps, dataBaseConnection } from "./functions.js";

import { ModalManagement } from "./modal.js";

const user = localStorage.getItem("user") || "";

const messageAuthorization = document.getElementById("message-authorization");
const authorizationForm = document.querySelector(".authorization");

const loginEmail = document.getElementById("login-email");
const password = document.getElementById("password");

if (authorizationForm) {
    authorizationForm.addEventListener("input", gaps);

    authorizationForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (user) {
            ModalManagement("You are already logged in!", "#message-modal", "#close-modal-message", authorizationForm);
        } else {
            authentication();
        }
    });
}

window.addEventListener("beforeunload", () => authorizationForm.reset());

if (loginEmail) loginEmail.addEventListener("blur", () => loginEmail.value = loginEmail.value.trim());

async function authentication() {
    const userData = {
        email: loginEmail.value,
        password: password.value,
    };

    const dataBaseConnectionResult = await dataBaseConnection("POST", "../phpDataBase/authorizationDatabase.php", userData);

    if (dataBaseConnectionResult === "User isn't registered") {
        messageAuthorization.textContent = "You are not in the system, please register!";

    } else if (dataBaseConnectionResult === "Blocking") {
        messageAuthorization.textContent = "Your account has been blocked";

    } else if (dataBaseConnectionResult === "Wrong") {
        messageAuthorization.textContent = "The login or password is incorrect!";

    } else if (dataBaseConnectionResult.split(",")[0] === "Login is successful") {
        localStorage.setItem("user", dataBaseConnectionResult.split(",")[1]);

        messageAuthorization.textContent = "";

        ModalManagement("Authorization is successful!", "#message-modal", "#close-modal-message", authorizationForm);
    }
}