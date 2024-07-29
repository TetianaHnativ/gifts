import { gaps, removeSpaces, dataBaseConnection, buttonAddToList } from "./functions.js";

import { ModalManagement, orderGiftsSubmit } from "./modal.js";

let gift = {
    id: 0,
    img: "./imgs/gift-img.jpg",
    name: "Not Found",
    category: "Not Found",
    price: 0,
    number: 0,
};

const giftString = sessionStorage.getItem("gift");

const user = parseInt(localStorage.getItem("user")) || 0;

if (giftString && giftString !== "undefined") gift = await dataBaseConnection("POST", "../phpDataBase/giftDataBase.php", { gift: JSON.parse(giftString).id });

const giftImg = document.querySelector(".gift-img");
const giftName = document.querySelector(".gift-name");
const giftCategory = document.querySelector(".gift-category");
const giftPrice = document.querySelector(".gift-price");
const giftAvailability = document.querySelector(".gift-availability");

giftImg.setAttribute("src", `../${gift.img}`);
giftImg.setAttribute("alt", gift.name);

giftName.textContent = gift.name;
giftCategory.textContent = gift.category;
giftPrice.textContent = gift.price + " грн.";

const giftBasket = document.querySelector(".gift-basket");
const giftSelected = document.querySelector(".gift-selected");
const giftBuyNow = document.querySelector(".gift-buy-now");

if (gift.number > 0) {
    giftAvailability.textContent = "У наявності";
    giftAvailability.style.color = "#038cff";
} else {
    giftAvailability.textContent = "Немає в наявності";
    giftAvailability.style.color = "#FF0000";

    buttonsStyle(giftBasket);
    buttonsStyle(giftBuyNow);
}

buttonAddToList({
    button: giftBasket,
    objectName: "gift",
    objectItemId: gift.id,
    user: user,
    path: "../phpDataBase/basketDatabase.php",
    messageItem: "Подарунок",
    messageList: "кошику",
    title: "Для додавання подарунку в кошик, будь ласка, авторизуйтеся!"
});

buttonAddToList({
    button: giftSelected,
    objectName: "gift",
    objectItemId: gift.id,
    user: user,
    path: "../phpDataBase/favouritesDatabase.php",
    messageItem: "Подарунок",
    messageList: "списку обраних",
    title: "Для додавання подарунку в обрані, будь ласка, авторизуйтеся!"
});

function buttonsStyle(button) {
    button.disabled = true;
    button.style.backgroundColor = "#CCCCCC";
    button.style.borderColor = "#CCCCCC";
    button.style.color = "#000";
}

if (giftBuyNow) giftBuyNow.addEventListener("click", () => {
    if (user > 0) {
        ModalManagement(``, "#order-modal", "#close-modal-order", 0);
        document.getElementById("order-form").reset();
    } else {
        ModalManagement("Для замовлення подарунку, будь ласка, авторизуйтеся!", "#message-modal", "#close-modal-message", 0);
    }
});

// ------------------------------------------------------------------ Modal ------------------------------------------------------------------

const numberInput = document.getElementById("modal-number-input");
numberInput.setAttribute('max', gift.number);

const priceOne = parseFloat(document.querySelector(".gift-price").textContent);

const modalPrice = document.querySelector(".modal-price");
modalPrice.textContent = (numberInput.value * priceOne).toFixed(2);

if (numberInput) numberInput.addEventListener("input", () => modalPrice.textContent = ((numberInput.value || 0) * priceOne).toFixed(2));

const modalPhone = document.getElementById("modal-phone");
const modalAddress = document.getElementById("modal-address");

if (modalPhone) modalPhone.addEventListener("input", gaps);

if (modalAddress) modalAddress.addEventListener("blur", removeSpaces);

const orderForm = document.getElementById("order-form");

if (orderForm) orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const gifts = [{ id: gift.id, number: numberInput.value, price: modalPrice.textContent }];

    orderGiftsSubmit({
        gifts: gifts,
        modalPrice: modalPrice,
        modalAddress: modalAddress,
        modalPhone: modalPhone,
        orderForm: orderForm,
        userID: user,
        place: "",
        formID: orderForm,
    });
});