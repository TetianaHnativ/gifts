import { gaps, removeSpaces, waitForElement, dataBaseConnection } from "./functions.js";

function showMessage(modal, title, modalClass) {
    let modalTitle = document.getElementById("modal-title-message");
    if (modal.getAttribute("id") === "delete-modal") modalTitle = document.getElementById("delete-title");
    if (modal.getAttribute("id") === "edit-idea-modal") modalTitle = document.getElementById("edit-idea-title");
    if (modalTitle) modalTitle.textContent = title;

    setTimeout(() => modal.style.display = "flex", 0);
    if (modalClass === "#message-modal") setTimeout(() => modal.style.display = "none", 5000);
}

async function modalClose(modal, closeButton, form) {
    if (closeButton)
        closeButton.addEventListener("click", function () {
            modal.style.display = "none";
            if (form > "") form.submit();
        });
}

async function ModalManagement(title, modalClass, closeModalClass, form) {
    const modal = await waitForElement(modalClass);
    const closeModal = await waitForElement(closeModalClass);

    if (modal && closeModal) {
        showMessage(modal, title, modalClass);
        modalClose(modal, closeModal, form);
    }

    if (form > "") setTimeout(() => form.submit(), 5000);
}

function radioButtonPackaging() {
    const radioButtons = document.querySelectorAll(".packaging-ragio");

    let selectedRadioButton = "";

    let packaging = "";

    if (radioButtons.length > 0) radioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
            selectedRadioButton = radioButton.value;
        }
    });

    switch (selectedRadioButton) {
        case "yellow-box-blue-ribbon":
            packaging = "Жовта коробка та блакитна стрічка";
            break;
        case "blue-box-yellow-ribbon":
            packaging = "Блакитна коробка та жовта стрічка";
            break;
        case "yellow-box-black-ribbon":
            packaging = "Жовта коробка та чорна стрічка";
            break;
        case "blue-box-white-ribbon":
            packaging = "Блакитна коробка та біла стрічка";
            break;
        default:
            console.log("Жодна радіокнопка не вибрана");
            break;
    }

    return packaging;
}

function processingIdeaElements({ modalImageUrl, modalName, modalIdeaPrice, modalPhoneIdea, modalDescription }) {
    if (modalImageUrl) modalImageUrl.addEventListener("input", gaps);
    if (modalName) modalName.addEventListener("blur", removeSpaces);
    if (modalIdeaPrice) {
        modalIdeaPrice.addEventListener("input", gaps);
        modalIdeaPrice.addEventListener("input", () => modalPhoneIdea.required = parseFloat(modalIdeaPrice.value) > 0 ? true : false);
    }
    if (modalPhoneIdea) modalPhoneIdea.addEventListener("input", gaps);
    if (modalDescription) modalDescription.addEventListener("blur", removeSpaces);
}

function handleIdeaForm({ modalImageUrl, modalName, modalIdeaPrice, modalPhoneIdea, modalDescription, ideaForm, ideaID, ideaUser, formID, messageAction }) {
    return async function (e) {
        e.preventDefault();

        const myIdea = {
            id: ideaID,
            img: modalImageUrl.value > "" ? modalImageUrl.value : "../imgs/idea-img.jpg",
            name: modalName.value,
            author: ideaUser,
            price: parseFloat(modalIdeaPrice.value) || 0,
            phone: modalPhoneIdea.value || "-",
            description: modalDescription.value,
        };

        const ideaDataBaseResult = await dataBaseConnection("POST", "../phpDataBase/IdeaDataBase.php", myIdea);

        if (ideaDataBaseResult === "Request is successful") {
            document.getElementById(formID).style.display = "none";
            ModalManagement(`Вашу ідею ${messageAction}!`, "#message-modal", "#close-modal-message", ideaForm);
        }
    }
}

async function orderGiftsSubmit({ gifts, modalPrice, modalAddress, modalPhone, orderForm, userID, place, formID }) {
    const orderGift = {
        gifts: JSON.stringify(gifts),
        price: parseFloat(modalPrice.textContent).toFixed(2),
        address: modalAddress.value,
        phone: modalPhone.value,
        packaging: radioButtonPackaging(),
        user: userID,
        place: place,
    };

    const orderDataBaseResult = await dataBaseConnection("POST", "../phpDataBase/orderDataBase.php", orderGift);

    if (orderDataBaseResult === "Order is successful") {
        formID.style.display = "none";
        ModalManagement("Замволення успішне!", "#message-modal", "#close-modal-message", orderForm);
    }
}

export {
    ModalManagement, modalClose, radioButtonPackaging, processingIdeaElements, handleIdeaForm, orderGiftsSubmit
};