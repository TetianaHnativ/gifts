import { loadHTML } from "./pageLoader.js";

window.onload = () => loadHTML('message-modal', 'messageModal.html');

import { gaps, removeSpaces, findElement, saveElementInSession, dataBaseConnection } from "./functions.js";

import { ModalManagement, modalClose, processingIdeaElements, handleIdeaForm, orderGiftsSubmit } from "./modal.js";

// --------------------------------------------------------- Header starts ---------------------------------------------------------

const menu = document.getElementById("menu");

const header = document.querySelector("header");

if (menu) menu.addEventListener("click", (evt) => {
    evt.target.classList.toggle("fa-times");
    if (header) header.classList.toggle("toggle");
});

window.addEventListener("scroll", () => {
    menu.classList.remove("fa-times");
    header.classList.remove("toggle");
});

// ---------------------------------------------------------- Header ends ----------------------------------------------------------

let userData = {
    id: 0,
    elements: "",
    username: "",
    surname: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    passwordConfirmation: "",
};

if (userData) userData.id = parseInt(localStorage.getItem("user")) || 0;

function giftsHTML(list, classHTML, listHTML) {
    if (list && list.length > 0) list.forEach((element) => {
        const li = document.createElement("li");
        li.classList.add(`${classHTML}-gift-item`);
        li.setAttribute("data-id", element.id);
        li.innerHTML = `
    <button class="delete-button ${classHTML}-gift-delete">x</button>
    <a class="gift-link" href="./gift.html"
        ><img
          src=../${element.img}
          alt=${element.name}
          class="gift-img"
      />
        <div class="gift-information">
          <h3 class="gift-name ${classHTML}-gift-name">${element.name}</h3>
          <p class="gift-category ${classHTML}-gift-category">${element.category}</p>
          <p class="gift-price ${classHTML}-gift-price">${element.price}</p>
        </div>
      </a>`;
        listHTML.append(li);
    });

}

function ideasHTML(list, classHTML, listHTML) {
    if (list && list.length > 0) list.forEach((element) => {
        const li = document.createElement("li");
        li.classList.add(`${classHTML}-idea-item`);
        li.setAttribute("data-id", element.id);

        const editButton = classHTML === "my" ? '<button class="edit-button my-idea-edit"><i class="fas fa-pen"></i></button>' : "";
        li.innerHTML = `
            <button class="delete-button ${classHTML}-idea-delete">x</button>
            ${editButton}
            <a class="idea-link" href="./idea.html">
              <img
              src=${element.img}
              alt=${element.name}
              class="idea-img"
              />
              <div class="idea-information">
                <h3 class="idea-name ${classHTML}-idea-name">${element.name}</h3>
                <p class="idea-author ${classHTML}-idea-author">${element.username} ${element.surname} </p>
                <p class="idea-price ${classHTML}-idea-price">${element.price > 0 ? element.price + " €" : "Free"}</p>
              </div>
            </a>`;
        listHTML.append(li);
    });
}

async function deletePart(deleteButton, element, objectName, modalTitleElement, modalTitleList) {
    const response = await dataBaseConnection("DELETE", "../phpDataBase/deleteDataBase.php", {
        id: element.id,
        name: objectName,
        user: userData.id,
    });

    if (response === "Deletion is successful") {
        deleteButton.style.display = "none";
        ModalManagement(`The ${modalTitleElement} has been removed from ${modalTitleList}!`, "#message-modal", "#close-modal-message", document.querySelector(".my-data-form"));
    }
}

function deleteModalFunction({ elementsClass, closestClass, array, objectName, modalTitleElement, modalTitleList }) {
    const deleteModal = document.getElementById("delete-modal");

    const deleteItemButton = document.getElementById("delete-item-button");
    const cancelItemButton = document.getElementById("cancel-item-button");

    modalClose(deleteModal, cancelItemButton, 0);

    const elementsDelete = document.querySelectorAll(elementsClass);

    if (elementsDelete)
        elementsDelete.forEach((button) => {
            if (button)
                button.addEventListener("click", (evt) => {
                    const element = findElement(evt, closestClass, array);
                    if (element && element !== "undefined") {
                        ModalManagement(`Do you really want to remove the ${modalTitleElement} "${element.name}" from ${modalTitleList}?`, "#delete-modal", "#delete-close-button", 0);

                        if (deleteItemButton) deleteItemButton.removeEventListener("click", handleDelete);

                        function handleDelete() {
                            deletePart(deleteModal, element, objectName, modalTitleElement, modalTitleList).then(() => {
                                deleteItemButton.removeEventListener("click", handleDelete);
                            });
                        }

                        if (deleteItemButton) deleteItemButton.addEventListener("click", handleDelete);
                    }
                });
        })
}

// ----------------------------------------------------- section id="favourites-gifts" -----------------------------------------------------

if (userData) userData.elements = "favourites-gifts";

const gifts = await dataBaseConnection("POST", "../phpDataBase/myAccountDataBase.php", { id: userData.id, elements: userData.elements }) || [];

const favouritesGifts = document.getElementById("favourites-gifts-list");

giftsHTML(gifts, "favourites", favouritesGifts);

if (favouritesGifts) favouritesGifts.addEventListener("click", (evt) => saveElementInSession(evt, ".favourites-gift-item", gifts, "gift"));

deleteModalFunction({
    elementsClass: ".favourites-gift-delete",
    closestClass: ".favourites-gift-item",
    array: gifts,
    objectName: "favourite-gift",
    modalTitleElement: "gift",
    modalTitleList: "Favourites"
});


// ------------------------------------------------------ section id="basket-gifts" ------------------------------------------------------

if (userData) userData.elements = "basket-gifts";

const basket = await dataBaseConnection("POST", "../phpDataBase/myAccountDataBase.php", { id: userData.id, elements: userData.elements }) || [];

const basketGifts = document.getElementById("basket-gifts-list");

giftsHTML(basket, "basket", basketGifts);

if (basketGifts) basketGifts.addEventListener("click", (evt) => saveElementInSession(evt, ".basket-gift-item", basket, "gift"));

deleteModalFunction({
    elementsClass: ".basket-gift-delete",
    closestClass: ".basket-gift-item",
    array: basket,
    objectName: "basket-gift",
    modalTitleElement: "gift",
    modalTitleList: "Cart"
});

const buyButton = document.getElementById("buy-button");

const basketModal = document.getElementById("basket-modal");

const orderForm = document.getElementById("order-form");

if (buyButton) buyButton.addEventListener("click", () => {
    ModalManagement("", "#basket-modal", "#basket-close-button", 0);
    orderForm.reset();
});

(basket && basket.length > 0) ? buyButton.disabled = false : buyButton.disabled = true;

const orderList = document.getElementById("order-list");

if (basket && basket.length > 0) basket.forEach((element) => {
    const li = document.createElement("li");
    li.classList.add("basket-modal-item");
    li.setAttribute("data-id", element.id);
    li.innerHTML = `
         <button type="button" class="delete-button order-delete">
           x
         </button>
         <img src="../${element.img}" alt="${element.name}" class="gift-img" />
         <div class="gift-information order-information">
           <h3 class="gift-name order-gift-name">
           ${element.name}
           </h3>
           <label for="number" class="modal-label-number"
             >Quantity:
             <input
               type="number"
               class="modal-field-number"
               min="1"
               max="${element.number}"
               value="1"
               required
             />
           </label>
           <p class="modal-price-text">
             Total price:
             <span class="modal-price one-price">${element.price}</span> €
           </p>
         </div>
       `;
    orderList.append(li);
});

const numberInputs = document.querySelectorAll(".modal-field-number");

if (numberInputs) numberInputs.forEach(function (numberInput) {
    if (numberInput) numberInput.addEventListener("input", function (evt) {
        const gift = findElement(evt, ".basket-modal-item", basket);
        const basketModalItem = evt.target.closest(".basket-modal-item");

        const quantity = parseFloat(numberInput.value) || 0;
        const totalPrice = (quantity * gift.price).toFixed(2) || 0;
        basketModalItem.querySelector(".modal-price").textContent = totalPrice;

        calculateTotalPrice();
    });
});

const allPrice = document.querySelector(".all-price");

function resetThePrice() {
    if (basket && basket.length > 0) {
        const modalPrices = document.querySelectorAll(".one-price");

        if (modalPrices.length > 0) {
            modalPrices.forEach((modalPrice, index) => {
                if (basket[index]) {
                    modalPrice.textContent = basket[index].price;
                }
            });
        }
    }
}

function calculateTotalPrice() {
    const modalPrices = document.querySelectorAll(".one-price");

    let orderPrice = 0;

    if (modalPrices) modalPrices.forEach((element) => orderPrice += parseFloat(element.textContent || 0));

    allPrice.textContent = orderPrice.toFixed(2);
}

calculateTotalPrice();

const orderDelete = document.querySelectorAll(".order-delete");

if (orderDelete) orderDelete.forEach((button) => {
    if (button) button.addEventListener("click", async function (evt) {
        const gift = findElement(evt, ".basket-modal-item", basket);
        if (gift && gift !== "undefined") {
            deletePart(basketModal, gift, "basket-gift", "gift", "Cart");
        }
    });
});

const addressModal = document.getElementById("address-modal");
if (addressModal) addressModal.addEventListener("blur", removeSpaces);

const modalPhoneBasket = document.getElementById("modal-phone-basket");
if (modalPhoneBasket) modalPhoneBasket.addEventListener("input", gaps);

const modalAllPrice = document.getElementById("modal-all-price");

modalPhoneBasket.value = userData.phone;

const basketModalItem = document.querySelectorAll(".basket-modal-item");

function orderGifts() {
    let i = 0;

    const gifts = [];

    if (basketModalItem) basketModalItem.forEach((element) => {
        gifts[i] = {};

        gifts[i].id = element.getAttribute("data-id");
        gifts[i].number = parseInt(element.querySelector(".modal-field-number").value);
        gifts[i].price = parseFloat(element.querySelector(".one-price").textContent).toFixed(2);

        i++;
    });

    return gifts;
}

const basketCloseButton = document.getElementById("basket-close-button");

if (basketCloseButton) basketCloseButton.addEventListener("click", () => {
    resetThePrice();
    calculateTotalPrice();
});

if (orderForm) orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const gifts = orderGifts();

    orderGiftsSubmit({
        gifts: gifts,
        modalPrice: modalAllPrice,
        modalAddress: addressModal,
        modalPhone: modalPhoneBasket,
        orderForm: orderForm,
        userID: userData.id,
        place: "basket",
        formID: basketModal,
    });
});


// ------------------------------------------------------- section id="my-data" -------------------------------------------------------
if (userData) userData.elements = "my-data";

const userTitle = document.querySelector(".user-title");

const dataForm = document.querySelector(".my-data-form");

const surname = document.getElementById("surname");
const username = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("login");
const oldPassword = document.getElementById("old-password");
const newPassword = document.getElementById("new-password");
const passwordConfirmation = document.getElementById("new-password-confirmation");

const confirmPasswordButton = document.querySelector(".confirm-button");
const submitButton = document.querySelector(".submit-button");

const message = document.querySelector(".message");

if (userData.id) {
    ElementsOptions(false, confirmPasswordButton, submitButton);
} else {
    ElementsOptions(true, confirmPasswordButton, submitButton);
}

window.addEventListener("beforeunload", function () {
    ElementsOptions(true, newPassword, passwordConfirmation);
    elementEmptyValue(oldPassword, newPassword, passwordConfirmation);
});


if (dataForm) dataForm.addEventListener("input", gaps);

if (email) email.addEventListener("blur", () => email.value = email.value.trim());

if (userData) {

    const data = await dataBaseConnection("POST", "../phpDataBase/myAccountDataBase.php", { id: userData.id, elements: userData.elements }) || [];

    if (Array.isArray(data) && data.length > 0) {
        userTitle.textContent = data[0].username + " " + data[0].surname;

        surname.value = data[0].surname;
        username.value = data[0].username;
        phone.value = data[0].phone;
        email.value = data[0].email;
    }

    myData();

    if (confirmPasswordButton) confirmPasswordButton.addEventListener("click", async function () {
        if (oldPassword.value) {
            userData.oldPassword = oldPassword.value;

            const checkPassword = await dataBaseConnection("POST", "../phpDataBase/checkPasswordDatabase.php", { id: userData.id, oldPassword: userData.oldPassword }) || "";

            if (checkPassword === "Old password is right") {
                ElementsOptions(false, newPassword, passwordConfirmation);
                message.textContent = "";

            } else if (checkPassword === "Old password is wrong") {
                ElementsOptions(true, newPassword, passwordConfirmation);
                message.textContent = "The old password is incorrect!";
                elementEmptyValue(oldPassword, newPassword, passwordConfirmation);

            } else {
                ElementsOptions(true, newPassword, passwordConfirmation);
                message.textContent = "Please, try again later!";
                elementEmptyValue(oldPassword, newPassword, passwordConfirmation);
            }

        } else {
            ElementsOptions(true, newPassword, passwordConfirmation);
            elementEmptyValue(oldPassword, newPassword, passwordConfirmation);
            message.textContent = "";
        }
    });

    if (dataForm) dataForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (newPassword.value && passwordConfirmation.value && newPassword.value !== passwordConfirmation.value) {
            message.textContent = "The new passwords do not match!";

        } else {
            message.textContent = "";

            myData();

            userData.newPassword = newPassword.value;

            const editUserData = await dataBaseConnection("POST", "../phpDataBase/editUserDataBase.php", userData) || "";

            let myMessage = "";

            if (editUserData === "Updating is successful") {
                myMessage = "Your data has been updated!";
            } else if (editUserData === "The update is successful except email") {
                myMessage = "Your details have been updated EXCEPT for email, this email address is already registered in the system, please choose another one!";
            } else {
                myMessage = "Please, try again later!";
                console.log(editUserData);
            }

            ModalManagement(myMessage, "#message-modal", "#close-modal-message", dataForm);
        }
    });
}

function myData() {
    userData.surname = surname.value;
    userData.username = username.value;
    userData.phone = phone.value;
    userData.email = email.value;
}

function ElementsOptions(value, ...elements) {
    elements.forEach(element => {
        if (element instanceof HTMLElement) {
            if (element.tagName === 'INPUT') element.required = !value;
            element.disabled = value;
        }
    });
}

function elementEmptyValue(...elements) {
    elements.forEach(element => {
        if (element instanceof HTMLElement) {
            element.value = '';
        }
    });
}
// ------------------------------------------------------ section id="my-ideas" ------------------------------------------------------

if (userData) userData.elements = "my-ideas";

const ownIdeas = await dataBaseConnection("POST", "../phpDataBase/myAccountDataBase.php", { id: userData.id, elements: userData.elements }) || [];

const myIdeas = document.getElementById("my-ideas-list");

ideasHTML(ownIdeas, "my", myIdeas);

if (myIdeas) myIdeas.addEventListener("click", (evt) => saveElementInSession(evt, ".my-idea-item", ownIdeas, "idea"));

deleteModalFunction({
    elementsClass: ".my-idea-delete",
    closestClass: ".my-idea-item",
    array: ownIdeas,
    objectName: "my-idea",
    modalTitleElement: "idea",
    modalTitleList: "all lists"
});

const ideaForm = document.getElementById("idea-form");

const modalImageUrl = document.getElementById("modal-imageUrl");
const modalName = document.getElementById("modal-name");
const modalIdeaPrice = document.getElementById("modal-price");
const modalPhoneIdea = document.getElementById("modal-phone-idea");
const modalDescription = document.getElementById("modal-description");

processingIdeaElements({
    modalImageUrl: modalImageUrl,
    modalName: modalName,
    modalIdeaPrice: modalIdeaPrice,
    modalPhoneIdea: modalPhoneIdea,
    modalDescription: modalDescription
});

const myIdeasEdit = document.querySelectorAll(".my-idea-edit");

let currentHandler = null;

if (myIdeasEdit) {
    myIdeasEdit.forEach((button) => {
        button.addEventListener("click", async function (evt) {
            const idea = findElement(evt, ".my-idea-item", ownIdeas);

            if (!idea) {
                console.error("Idea not found");
                return;
            }

            ModalManagement(`Editing an idea "${idea.name}"`, "#edit-idea-modal", "#close-modal-idea", 0);

            modalImageUrl.value = idea.img !== "../imgs/idea-img.jpg" ? idea.img : "";
            modalName.value = idea.name;
            modalIdeaPrice.value = idea.price;
            modalPhoneIdea.value = idea.phone !== "-" ? idea.phone : "";
            modalDescription.value = idea.description;

            if (ideaForm) {
                if (currentHandler) {
                    ideaForm.removeEventListener("submit", currentHandler);
                }
                currentHandler = handleIdeaForm({
                    modalImageUrl: modalImageUrl,
                    modalName: modalName,
                    modalIdeaPrice: modalIdeaPrice,
                    modalPhoneIdea: modalPhoneIdea,
                    modalDescription: modalDescription,
                    ideaForm: ideaForm,
                    ideaID: idea.id,
                    ideaUser: userData.id,
                    formID: "edit-idea-modal",
                    messageAction: "edited",
                });
                ideaForm.addEventListener("submit", currentHandler);
            }
        });
    });
}


// ----------------------------------------------------- section id="favourites-ideas" -----------------------------------------------------

if (userData) userData.elements = "favourites-ideas";

const ideas = await dataBaseConnection("POST", "../phpDataBase/myAccountDataBase.php", { id: userData.id, elements: userData.elements }) || [];

const favouritesIdeas = document.getElementById("favourites-ideas-list");

ideasHTML(ideas, "favourites", favouritesIdeas);

if (favouritesIdeas) favouritesIdeas.addEventListener("click", (evt) => saveElementInSession(evt, ".favourites-idea-item", ideas, "idea"));

deleteModalFunction({
    elementsClass: ".favourites-idea-delete",
    closestClass: ".favourites-idea-item",
    array: ideas,
    objectName: "favourite-idea",
    modalTitleElement: "idea",
    modalTitleList: "Favourites"
});

// ------------------------------------------------------------------ Exit ------------------------------------------------------------------

const logOut = document.querySelector(".log-out");

if (logOut) logOut.addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "/favouritegift/html";
});