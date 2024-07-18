import { loadHTML } from "./pageLoader.js";

window.onload = function () {
    loadHTML('header', 'header.html');
    loadHTML('message-modal', 'messageModal.html');
};

import { gaps, waitForElement, showMessage, modalManagement, dataBaseConnection } from "./functions.js";

const surname = document.getElementById("surname");
const username = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("login");
const password = document.getElementById("password");
const passwordConfirmation = document.getElementById("password-confirmation");

const message = document.querySelector(".message");
const registrationForm = document.querySelector(".registration");

if (registrationForm) {
    registrationForm.addEventListener("input", gaps);

    registrationForm.addEventListener("submit", function (event) {
        try {
            event.preventDefault();

            if (password.value !== passwordConfirmation.value) {
                message.textContent = "Паролі не збігаються!";
            } else {
                message.textContent = "";

                saveUserData();
            }
        } catch (error) {
            console.error(error);
        }
    });
}

if (email) {
    email.addEventListener("blur", () => email.value = email.value.trim());
}


window.addEventListener("beforeunload", () => registrationForm.reset());


async function saveUserData() {

    let userData = {
        surname: surname.value,
        username: username.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
    };

    const dataBaseConnectionResult = await dataBaseConnection("POST", "../phpDataBase/registrationDataBase.php", userData);

    if (dataBaseConnectionResult === "Email is already registered") {
        message.textContent = "Користувач з такою поштою вже зареєстрований у системі";
        
    } else if (dataBaseConnectionResult === "Registration successful") {

        message.textContent = "";

        // ----------------- modal starts -----------------

        const messageModal = await waitForElement("#message-modal");
        const closeModalMessage = await waitForElement("#close-modal-message");

        modalManagement(messageModal, registrationForm, closeModalMessage);

        showMessage(messageModal, "Реєстрація успішна!");

        // ------------------- modal ends -------------------

        setTimeout(() => registrationForm.submit(), 5000);

    }
}