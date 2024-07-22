import { gaps, ModalManagement, radioButtonPackaging, dataBaseConnection, addToList } from "./functions.js";

let gift = {
    id: 0,
    img: "../imgs/gift-img.jpg",
    name: "Not Found",
    category: "Not Found",
    price: 0,
    number: 0,
};

const giftString = sessionStorage.getItem("gift");

const user = parseInt(localStorage.getItem("user")) || 0;

if (giftString) gift = await dataBaseConnection("POST", "../phpDataBase/giftsDataBase.php", {gift: JSON.parse(giftString)});

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


giftBasket.addEventListener("click", () => {
    if (user !== 0) {
        addToList("gift", gift.id, user, "../phpDataBase/basketDatabase.php", "Подарунок", "кошику");
    } else {
        ModalManagement("Авторизуйтеся, будь ласка!", "#message-modal", "#close-modal-message", 0);
    }
});

giftSelected.addEventListener("click", () => {
    if (user !== 0) {
        addToList("gift", gift.id, user, "../phpDataBase/favouritesDatabase.php", "Подарунок", "списку обраних");
    } else {
        ModalManagement("Авторизуйтеся, будь ласка!", "#message-modal", "#close-modal-message", 0);
    }
});

if (gift.number > 0) {
    giftAvailability.textContent = "У наявності";
    giftAvailability.style.color = "#038cff";
} else {
    giftAvailability.textContent = "Немає в наявності";
    giftAvailability.style.color = "#FF0000";

    buttonsStyle(giftBasket);
    buttonsStyle(giftBuyNow);
}

function buttonsStyle(button) {
    button.disabled = true;
    button.style.backgroundColor = "#CCCCCC";
    button.style.borderColor = "#CCCCCC";
    button.style.color = "#000";
}

const openButton = document.querySelector(".gift-buy-now");

if (openButton) openButton.addEventListener("click", () => {
    ModalManagement(``, "#order-modal", "#close-modal-order", 0);
    document.querySelector("#order-form").reset();
});

// ------------------------------------------------------------------ Modal ------------------------------------------------------------------

const numberInput = document.querySelector("#modal-number-input");
numberInput.setAttribute('max', gift.number);

const priceOne = parseFloat(document.querySelector(".gift-price").textContent);

const modalPrice = document.querySelector(".modal-price");
modalPrice.textContent = (numberInput.value * priceOne).toFixed(2);

numberInput.addEventListener("input", () => modalPrice.textContent = ((numberInput.value || 0) * priceOne).toFixed(2));

const modalPhone = document.getElementById("modal-phone");
const modalAddress = document.getElementById("modal-address");

if (modalPhone) modalPhone.addEventListener("input", gaps);

if (modalAddress) modalAddress.addEventListener("blur", () => modalAddress.value = modalAddress.value.trim().replace(/\s+/g, " "));

const packaging = radioButtonPackaging();

const orderForm = document.querySelector("#order-form");

orderForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const orderGift = {
        gifts: JSON.stringify([{ id: gift.id, number: numberInput.value, price: modalPrice.textContent }]),
        price: modalPrice.textContent,
        address: modalAddress.value,
        phone: modalPhone.value,
        packaging: packaging,
        user: user,
    }

    const orderDataBaseResult = await dataBaseConnection("POST", "../phpDataBase/orderDataBase.php", orderGift);

    if (orderDataBaseResult === "Order is successful") {
        orderForm.style.display = "none";
        ModalManagement("Подарунок замовлено!", "#message-modal", "#close-modal-message", orderForm);
    }
});