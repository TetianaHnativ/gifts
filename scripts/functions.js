function gaps(event) {
    if (event.target.value.includes(" ")) {
        event.target.value = event.target.value.replace(/\s/g, "");
    }
}

function showMessage(modal, title) {
    document.getElementById("modal-title-message").textContent = title;

    setTimeout(function () {
        modal.style.display = "flex";
    }, 0);

    setTimeout(function () {
        modal.style.display = "none";
    }, 5000);
}

async function modalManagement(modal, form, closeButton) {
    if (closeButton) {
        closeButton.addEventListener("click", function () {
            modal.style.display = "none";
            form.submit();
        });
    }
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


export { gaps, delay, waitForElement, showMessage, modalManagement };

