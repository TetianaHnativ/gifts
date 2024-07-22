import { loadHTMLWithoutHeader } from "./pageLoader.js";

loadHTMLWithoutHeader();

import { gaps, ModalManagement, dataBaseConnection } from "./functions.js";

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

if (email) email.addEventListener("blur", () => email.value = email.value.trim());

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

        ModalManagement("Реєстрація успішна!", "#message-modal", "#close-modal-message", registrationForm);

        setTimeout(() => registrationForm.submit(), 5000);
    }
}