import { waitForElement, showMessage } from "./function.js";

function questionnaireLink() {
    window.location.href = "questionnaire.html";
}

async function questionnaireLinkGo() {
    try {
        const questionnaireLinkButton = document.querySelector(".questionnaire-link");

        const user = localStorage.getItem("user");

        // ----------------- modal starts -----------------
        const messageModal = await waitForElement("#message-modal");

        const messageCloseModal = await waitForElement("#close-modal-message");

        messageCloseModal.addEventListener(
            "click",
            () => (messageModal.style.display = "none")
        );
        // ------------------- modal ends -------------------

        questionnaireLinkButton.addEventListener("click", () => {
            if (user) {
                questionnaireLink();
            } else {
                showMessage(messageModal);
            }
        });
    } catch (error) {
        console.error(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    questionnaireLinkGo();
});


//localStorage.setItem("user", 1); - перевірка
//localStorage.removeItem("user"); - перевірка