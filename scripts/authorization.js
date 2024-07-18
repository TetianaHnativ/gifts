import { loadHTML } from "./pageLoader.js";

window.onload = function () {
    loadHTML('header', 'header.html');
    loadHTML('message-modal', 'messageModal.html');
};

import { gaps, ModalMessage, dataBaseConnection } from "./functions.js";

const user = localStorage.getItem("user") || "";

const messageAuthorization = document.getElementById("message-authorization");
const authorizationForm = document.querySelector(".authorization");
const passwordLink = document.querySelector(".password-link");

const loginEmail = document.getElementById("login-email");
const password = document.getElementById("password");

if (authorizationForm) {
    authorizationForm.addEventListener("input", gaps);

    authorizationForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (user) {
            ModalMessage("Ви вже авторизовані в системі!", authorizationForm);
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
        messageAuthorization.textContent = "Вас немає в системі, зареєструйтеся, будь ласка!";

    } else if (dataBaseConnectionResult === "Blocking") {
        messageAuthorization.textContent = "Ваш обліковий запис заблоковано";

    } else if (dataBaseConnectionResult === "Wrong") {
        messageAuthorization.textContent = "Логін або пароль неправильні!";

    } else if (dataBaseConnectionResult.split(",")[0] === "Login successful") {
        localStorage.setItem("user", dataBaseConnectionResult.split(",")[1]);

        messageAuthorization.textContent = "";

        ModalMessage("Авторизація успішна!", authorizationForm);
    }
}

if (passwordLink) passwordLink.addEventListener("click", () => ModalMessage("Ця функція в розробці!", 0));