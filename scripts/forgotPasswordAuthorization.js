import { gaps, ModalManagement, dataBaseConnection } from "./functions.js";

const passwordLink = document.querySelector(".password-link");

if (passwordLink) passwordLink.addEventListener("click", () => {
    ModalManagement("", "#authorization-modal", "#authorization-close-button", 0);
    document.querySelector("#forgot-password-form").reset();
});

const modalEmail = document.getElementById("modal-email");

if (modalEmail) modalEmail.addEventListener("blur", () => modalEmail.value = modalEmail.value.trim());

const modalNumberConfirmation = document.getElementById("modal-number-confirmation");
const modalPassword = document.getElementById("modal-password");
const modalPasswordConfirmation = document.getElementById("modal-password-confirmation");

const buttonModalSend = document.getElementById("button-modal-send");
const buttonModalConfirmation = document.getElementById("button-modal-confirmation");
const buttonModalSave = document.getElementById("button-modal-save");

const messageModalPassword = document.getElementById("message-modal-password");

const forgotPasswordForm = document.querySelector("#forgot-password-form");

if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("input", gaps);

    forgotPasswordForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (event.submitter === buttonModalSend) {
            fetchFunction(sendEmail);
        }
        if (event.submitter === buttonModalConfirmation) {
            fetchFunction(numberChecking);
        }
        if (event.submitter === buttonModalSave) {
            fetchFunction(passwordChecking);
        }
    });
}


async function fetchFunction(myFunction) {
    const changePassword = {
        email: modalEmail.value,
        numberConfirmation: modalNumberConfirmation.value,
        password: modalPassword.value,
        passwordConfirmation: modalPasswordConfirmation.value,
        action: myFunction.name,
    };

    const dataBaseConnectionResult = await dataBaseConnection("POST", "../phpDataBase/forgotPasswordDatabase.php", changePassword);

    myFunction(dataBaseConnectionResult);
}


function sendEmail(data) {
    if (data === "Email is wrong") {
        messageModalPassword.textContent = "Електронна пошта неправильна!";

        modalNumberDisabled(true);
        modalPasswordDisabled(true);
    } else if (data === "Random number sent to email") {
        messageModalPassword.textContent = "";
        modalNumberDisabled(false);
    } else {
        messageModalPassword.textContent = "Помилка відправлення листа!";
    }
}

function numberChecking(data) {
    if (data === "Only email is right") {
        messageModalPassword.textContent = "Неправильне число!";
        modalPasswordDisabled(true);
    } else if (data === "Random number request is successful") {
        messageModalPassword.textContent = "";
        modalPasswordDisabled(false);
    }
}

function passwordChecking(data) {
    if (data === "Passwords do not match") {
        messageModalPassword.textContent = "Паролі не збігаються!";
    } else if (data === "Updating password request is successful") {
        messageModalPassword.textContent = "";
        document.getElementById("authorization-modal").style.display = "none";
        ModalManagement("Ваш пароль оновлено!", "#message-modal", "#close-modal-message", forgotPasswordForm);
    }
}

function modalNumberDisabled(value) {
    isElementDisabled(modalNumberConfirmation, value);
    isElementDisabled(buttonModalConfirmation, value);
}

function modalPasswordDisabled(value) {
    isElementDisabled(modalPassword, value);
    isElementDisabled(modalPasswordConfirmation, value);
    isElementDisabled(buttonModalSave, value);
}

function isElementDisabled(element, value) {
    element.disabled = value;
    if (value === true && element.tagName.toLowerCase() !== 'button') element.value = "";
}