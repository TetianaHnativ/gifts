import { loadHTMLWithoutHeader } from "./pageLoader.js";

loadHTMLWithoutHeader();

import { gaps, dataBaseConnection } from "./functions.js";

import { ModalManagement } from "./modal.js";

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
                message.textContent = "Passwords do not match!";
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
        message.textContent = "The user with this email is already registered in the system";

    } else if (dataBaseConnectionResult === "Registration is successful") {
        message.textContent = "";

        ModalManagement("Registration is successful!", "#message-modal", "#close-modal-message", registrationForm);

        setTimeout(() => registrationForm.submit(), 5000);
    }
}