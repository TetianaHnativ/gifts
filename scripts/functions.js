function gaps(event) {
    if (event.target.value.includes(" ")) {
        event.target.value = event.target.value.replace(/\s/g, "");
    }
}

function showCondition(condition, element) {
    if (condition) {
        element.style.display = "flex";
    } else {
        element.style.display = "none";
    }
};

function saveElementInSession(evt, closestClass, array, sessionStorageName) {
    const elementsListItem = evt.target.closest(closestClass);
    if (elementsListItem) {
        const elementId = elementsListItem.getAttribute("data-id");
        const element = array.find((element) => element.id === elementId);
        sessionStorage.setItem(sessionStorageName, JSON.stringify(element.id));
    }
}

function searchByName(elementsListItem, elementClass) {
    const search = document.querySelector(".search-input").value.toLowerCase();

    elementsListItem.forEach((element) => {
        const elementName = element.querySelector(elementClass).textContent.toLowerCase();
        showCondition(elementName.includes(search), element);
    });
}

function sortItems(elementsListItem, priceClass, elementsList) {
    const sortValue = document.querySelector(".sort-list").value;
    const elementsArray = Array.from(elementsListItem);

    function sortByPrice() {
        elementsArray.sort(function (a, b) {
            let priceA = parseInt(a.getElementsByClassName(priceClass)[0].innerText) || 0;
            let priceB = parseInt(b.getElementsByClassName(priceClass)[0].innerText) || 0;
            return priceA - priceB;
        });
    }

    if (sortValue === "cheap") {
        sortByPrice();
    } else if (sortValue === "expensive") {
        sortByPrice();
        elementsArray.reverse();
    }

    elementsList.innerHTML = "";
    elementsArray.forEach(function (item) {
        elementsList.appendChild(item);
    });
}

// ----------------- modal functions start -----------------

function showMessage(modal, title, modalClass) {
    const modalTitleMessage = document.getElementById("modal-title-message");
    if (modalTitleMessage) modalTitleMessage.textContent = title;

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

// ------------------- modal functions end -------------------

async function delay(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForElement(selector, timeout = 5000) {
    const interval = 100;
    const endTime = Date.now() + timeout;

    while (Date.now() < endTime) {
        const element = document.querySelector(selector);
        if (element) return element;
        await delay(interval);
    }

    throw new Error(`Element with selector "${selector}" not found within ${timeout}ms`);
}

async function dataBaseConnection(method, server, myData) {
    try {
        const response = await fetch(server, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(myData),
            cache: "no-cache",
        });
        if (!response.ok) {
            throw new Error("status code: " + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("error:", error);
        return error;
    }
}

async function addToList(objectName, objectItemId, user, path, messageItem, messageList) {
    const myObject = {
        name: objectName,
        itemId: objectItemId,
        user: user,
    };

    const itemInTable = await dataBaseConnection("POST", path, myObject);

    if (itemInTable === "Item is already exist") {
        ModalManagement(`${messageItem} вже додано до ${messageList}!`, "#message-modal", "#close-modal-message", 0);
    } else if (itemInTable === "Item is added") {
        ModalManagement(`${messageItem} додано до ${messageList}!`, "#message-modal", "#close-modal-message", 0);
    }

}

export { gaps, showCondition, saveElementInSession, searchByName, sortItems, waitForElement, ModalManagement, radioButtonPackaging, dataBaseConnection, addToList };