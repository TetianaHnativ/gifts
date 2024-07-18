function gaps(event) {
    if (event.target.value.includes(" ")) {
        event.target.value = event.target.value.replace(/\s/g, "");
    }
}

// ----------------- modal functions start -----------------

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

 // ------------------- modal function end -------------------

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


export { gaps, delay, waitForElement, showMessage, modalManagement, dataBaseConnection };

