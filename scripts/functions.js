import { ModalManagement } from "./modal.js";

function gaps(event) {
    if (event.target.value.includes(" ")) {
        event.target.value = event.target.value.replace(/\s/g, "");
    }
}

function removeSpaces(event) {
    event.target.value = event.target.value.trim().replace(/\s+/g, " ");
};

function showCondition(condition, element) {
    if (condition) {
        element.style.display = "flex";
    } else {
        element.style.display = "none";
    }
};

function findElement(evt, closestClass, array) {
    const elementsListItem = evt.target.closest(closestClass);
    if (elementsListItem) {
        const elementId = elementsListItem.getAttribute("data-id");
        const element = array.find((element) => parseInt(element.id) === parseInt(elementId));
        return element || 0;
    }
    return 0;
}

function saveElementInSession(evt, closestClass, array, sessionStorageName) {
    if (findElement(evt, closestClass, array))
        sessionStorage.setItem(sessionStorageName, JSON.stringify(findElement(evt, closestClass, array)));
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

async function addToList({ objectName, objectItemId, user, path, messageItem, messageList }) {
    const myObject = {
        name: objectName,
        itemId: objectItemId,
        user,
    };

    const itemInTable = await dataBaseConnection("POST", path, myObject);

    const message = itemInTable === "Item is already exist" ? `${messageItem} вже додано до ${messageList}!` : `${messageItem} додано до ${messageList}!`;

    ModalManagement(message, "#message-modal", "#close-modal-message", 0);

}

function buttonAddToList({ button, objectName, objectItemId, user, path, messageItem, messageList, title }) {
    if (button) button.addEventListener("click", () => {
        if (user > 0) {
            addToList({ objectName, objectItemId, user, path, messageItem, messageList });
        } else {
            ModalManagement(title, "#message-modal", "#close-modal-message", 0);
        }
    });
}

export {
    gaps, removeSpaces, showCondition, findElement, saveElementInSession,
    searchByName, sortItems, waitForElement, dataBaseConnection, buttonAddToList
};