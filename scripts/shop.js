import { saveElementInSession, searchByName, sortItems, dataBaseConnection, ModalMessage } from "./functions.js";

const userInSystem = localStorage.getItem("user") || "";

const giftsList = document.querySelector(".gifts-list");

const gifts = await dataBaseConnection("GET", "../phpDataBase/shopDatabase.php", undefined) || [];

if (gifts.length > 0) {
  gifts.forEach((element) => {
    const li = document.createElement("li");
    li.classList.add("gifts-list-item");
    li.setAttribute("data-id", element.id);
    li.innerHTML = `<a href="./gift.html"
              ><img
                src=../${element.img}
                alt=${element.name}
                class="gift-img"
            />
              <div class="gift-information">
                <h3 class="gift-name">${element.name}</h3>
                <p class="gift-category">${element.category}</p>
                <p class="gift-price">${element.price} грн.</p>
              </div>
            </a>`;
    giftsList.append(li);
  });
}

const giftsListItem = document.querySelectorAll(".gifts-list-item");

if (giftsList) giftsList.addEventListener("click", (evt) => saveElementInSession(evt, ".gifts-list-item", gifts, "gift"));

//------------------------------------------------------------ Search by name ------------------------------------------------------------

const searchInput = document.querySelector(".search-input");

if (searchInput) searchInput.addEventListener("blur", () => searchInput.value = searchInput.value.trim().replace(/\s+/g, " "));

window.addEventListener("pageshow", () => searchInput.value = "");

const searchButton = document.querySelector(".search-button");

if (searchButton) searchButton.addEventListener("click", () => searchByName(giftsListItem, ".gift-name"));

//---------------------------------------------------------------- Sorting ----------------------------------------------------------------

const sortList = document.querySelector(".sort-list");

if (sortList) sortList.addEventListener("change", () => sortItems(giftsListItem, "gift-price", giftsList));

//---------------------------------------------------------- Buttons-categories ----------------------------------------------------------

const buttonsList = document.querySelector(".buttons-list");

if (buttonsList) {
  buttonsList.addEventListener("click", (evt) => {
    const shopButton = evt.target.closest(".shop-button");
    if (shopButton) {
      const categoryButton = shopButton.textContent;
      filterGifts(categoryButton);
    }
  });
}

const filterGifts = (filter) => {
  giftsListItem.forEach((gift) => {
    const categoryGift = gift.querySelector(".gift-category").textContent;
    if (filter !== "Усі" && categoryGift !== filter) {
      gift.style.display = "none";
    } else {
      gift.style.display = "flex";
    }
  });
  searchInput.value = "";
};

//---------------------------------------------------------------- BASKET ----------------------------------------------------------------

const basketLink = document.querySelector(".basket-link");

const basketNumber = document.querySelector(".basket-number");

if (basketLink && basketNumber) {
  if (userInSystem > 0) {
    basketLink.href = "./myAccount.html #basket";
    basketNumber.textContent = await dataBaseConnection("POST", "../phpDataBase/basketNumberDatabase.php", { user: userInSystem });
  } else {
    basketLink.href = "#";
    basketLink.addEventListener("click", () => ModalMessage("Для переходу в кошик авторизуйтеся, будь ласка!", 0));
  }
}

