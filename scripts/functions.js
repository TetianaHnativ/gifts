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
        sessionStorage.setItem(sessionStorageName, JSON.stringify(element));
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

function showMessage(modal, title) {
    const modalTitleMessage = document.getElementById("modal-title-message");
    if (modalTitleMessage) modalTitleMessage.textContent = title;
    setTimeout(() => modal.style.display = "flex", 0);
    setTimeout(() => modal.style.display = "none", 5000);
}

async function modalClose(modal, closeButton, form) {
    if (closeButton)
        closeButton.addEventListener("click", function () {
            modal.style.display = "none";
            if (form > "") form.submit();
        });
}

async function ModalMessage(title, form) {
    const messageModal = await waitForElement("#message-modal");
    const closeModalMessage = await waitForElement("#close-modal-message");

    if (messageModal && closeModalMessage) {
        showMessage(messageModal, title);
        modalClose(messageModal, closeModalMessage, form);
    }

    if (form > "") setTimeout(() => form.submit(), 5000);
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

export { gaps, showCondition, saveElementInSession, searchByName, sortItems, waitForElement, ModalMessage, dataBaseConnection };