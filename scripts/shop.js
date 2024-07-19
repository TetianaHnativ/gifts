import { showCondition, saveElementInSession, searchByName, sortItems, dataBaseConnection, ModalMessage } from "./functions.js";

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

function filterItems(filterParametr, categories) {
  giftsListItem.forEach((element) => {
    const categoryGift = element.querySelector(".gift-category").textContent;

    if (filterParametr === "filterGiftsByButtons") {
      showCondition((categories === "Усі" || categoryGift === categories), element);
    } else if (filterParametr === "filterGiftsQuestionnaire") {
      showCondition((categories.includes(categoryGift)), element);
    }
  });

  searchInput.value = "";
};

const buttonsList = document.querySelector(".buttons-list");

if (buttonsList) buttonsList.addEventListener("click", (evt) => {
  const shopButton = evt.target.closest(".shop-button");
  if (shopButton) {
    const categoryButton = shopButton.textContent;
    filterItems("filterGiftsByButtons", categoryButton);
  }
});


//------------------------------------------------------------ Questionnaire ------------------------------------------------------------

const clickedButton = sessionStorage.getItem("clickedButton");

if (clickedButton === "true") {
  sessionStorage.removeItem("clickedButton");

  const questionnaireString = sessionStorage.getItem("filter");

  let questionnaireFilter = [];

  if (questionnaireString) questionnaireFilter = JSON.parse(questionnaireString);

  let categories = [];

  if (questionnaireFilter.length > 0) {
    const categoryConditions = [
      { filters: ["male"], category: "Для чоловіків" },
      { filters: ["female"], category: "Для жінок" },
      { filters: ["child"], category: "Для дітей" },
      { filters: ["elderly"], category: "Для літніх людей" },
      { filters: ["office", "child", "blogging"], category: "Канцелярія" },
      { filters: ["technology", "blogging"], category: "Техніка" },
      { filters: ["housekeeping"], category: "Товари для дому" },
      { filters: ["christmas", "st-valentine-day", "st-nicholas-day"], category: "Свята" }
    ];

    categoryConditions.forEach(element => {
      if (element.filters.some(filter => questionnaireFilter.includes(filter))) {
        categories.push(element.category);
      }
    });
  } else {
    console.log("Користувач просто переходить на другу сторінку");
  }

  filterItems("filterGiftsQuestionnaire", categories);

  sessionStorage.removeItem("filter");
}

//---------------------------------------------------------------- BASKET ----------------------------------------------------------------

const basketLink = document.querySelector(".basket-link");

const basketNumber = document.querySelector(".basket-number");

if (basketLink && basketNumber)
  if (userInSystem > 0) {
    basketLink.href = "./myAccount.html #basket";
    basketNumber.textContent = await dataBaseConnection("POST", "../phpDataBase/basketNumberDatabase.php", { user: userInSystem });
  } else {
    basketLink.href = "#";
    basketLink.addEventListener("click", () => ModalMessage("Для переходу в кошик авторизуйтеся, будь ласка!", 0));
  }
