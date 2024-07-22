import { ModalManagement } from "./functions.js";

function questionnaireLink() {
    window.location.href = "questionnaire.html";
}

async function questionnaireLinkGo() {
    try {
        const questionnaireLinkButton = document.querySelector(".questionnaire-link");

        const user = localStorage.getItem("user");

        if (questionnaireLinkButton) {
            questionnaireLinkButton.addEventListener("click", () => {
                if (user) {
                    questionnaireLink();
                } else {
                    ModalManagement("Для заповнення анкети авторизуйтеся, будь ласка!", "#message-modal", "#close-modal-message", 0);
                }
            });
        }
    } catch (error) {
        console.error(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => questionnaireLinkGo());