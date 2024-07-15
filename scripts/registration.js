import { loadHTML } from "./pageLoader.js";

window.onload = function () {
    loadHTML('header', 'header.html');
    loadHTML('message-modal', 'messageModal.html');
};

import { gaps, waitForElement, showMessage, modalManagement } from "./functions.js";

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

    // ----------------- modal starts -----------------
    const messageModal = await waitForElement("#message-modal");
    const closeModalMessage = await waitForElement("#close-modal-message");

    modalManagement(messageModal, registrationForm, closeModalMessage);
    // ------------------- modal ends -------------------

    fetch("../phpDataBase/registrationDataBase.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("status code:" + response.status);
            }
            return response.text();
        })
        .then((data) => {
            if (data.trim() === "Email is already registered") {
                message.textContent =
                    "Користувач з такою поштою вже зареєстрований у системі";
            } else if (data.trim() === "Registration successful") {
                message.textContent = "";

                showMessage(messageModal, "Реєстрація успішна!");

                registrationForm.submit();
            }
        })
        .catch((error) => {
            console.error("error: ", error);
        });
}

