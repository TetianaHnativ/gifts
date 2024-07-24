import { gaps, saveElementInSession, searchByName, sortItems, dataBaseConnection, ModalManagement } from "./functions.js";

const removeSpaces = (event) => event.target.value = event.target.value.trim().replace(/\s+/g, " ");

const user = localStorage.getItem("user") || "";

const ideasList = document.querySelector(".ideas-list");

const ideas = await dataBaseConnection("GET", "../phpDatabase/allIdeaDataBase.php", undefined) || [];

if (ideas.length > 0) {
    ideas.forEach((element) => {
        const li = document.createElement("li");
        li.classList.add("ideas-list-item");
        li.setAttribute("data-id", element.id);
        li.innerHTML = `<a href="./idea.html"
                    ><img
                        src=${element.img}
                        alt=${element.name}
                        class="idea-img"
                    />
                    <div class="idea-information">
                        <h3 class="idea-name">${element.name}</h3>
                        <p class="idea-author">${element.surname} ${element.username}</p>
                        <p class="idea-price">${element.price > 0 ? element.price + " грн." : "Безкоштовно"} </p>
                    </div>
                </a>`;
        ideasList.append(li);
    });
}

const ideasListItem = document.querySelectorAll(".ideas-list-item");

if (ideasList) ideasList.addEventListener("click", (evt) => saveElementInSession(evt, ".ideas-list-item", ideas, "idea"));

//------------------------------------------------------------ Search by name ------------------------------------------------------------

const searchInput = document.querySelector(".search-input");

if (searchInput) searchInput.addEventListener("blur", removeSpaces);

window.addEventListener("pageshow", () => searchInput.value = "");

const searchButton = document.querySelector(".search-button");

if (searchButton) searchButton.addEventListener("click", () => searchByName(ideasListItem, ".idea-name"));

//---------------------------------------------------------------- Sorting ----------------------------------------------------------------

const sortList = document.querySelector(".sort-list");

if (sortList) sortList.addEventListener("change", () => sortItems(ideasListItem, "idea-price", ideasList));

//------------------------------------------------------------ Add idea modal ------------------------------------------------------------

const addIdeaButton = document.getElementById("add-idea");

if (addIdeaButton) addIdeaButton.addEventListener("click", () => {
    if (user > 0) {
        ModalManagement(``, "#add-idea-modal", "#close-modal-idea", 0);
        document.querySelector("#idea-form").reset();
    } else {
        ModalManagement("Для додавання ідеї, будь ласка, авторизуйтеся в системі!", "#message-modal", "#close-modal-message", 0);
    }
});

const modalImageUrl = document.getElementById("modal-imageUrl");
const modalName = document.getElementById("modal-name");
const modalPrice = document.getElementById("modal-price");
const modalPhone = document.getElementById("modal-phone");
const modalDescription = document.getElementById("modal-description");

if (modalImageUrl) modalImageUrl.addEventListener("input", gaps);
if (modalName) modalName.addEventListener("blur", removeSpaces);
if (modalPrice) modalPrice.addEventListener("input", gaps);
if (modalPhone) modalPhone.addEventListener("input", gaps);
if (modalDescription) modalDescription.addEventListener("blur", removeSpaces);

let newIdea = {
    img: "../imgs/idea-img.jpg",
    name: "",
    price: 0,
    phone: "",
    description: "",
    author: user,
};

if (modalPrice) modalPrice.addEventListener("input", () => modalPhone.required = parseFloat(modalPrice.value) > 0 ? true : false);

const ideaForm = document.getElementById("idea-form");

if (ideaForm) ideaForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    newIdea = {
        img: modalImageUrl.value > "" ? modalImageUrl.value : "../imgs/idea-img.jpg",
        name: modalName.value,
        author: user,
        price: parseFloat(modalPrice.value) || 0,
        phone: modalPhone.value || "-",
        description: modalDescription.value,
        id: ""
    };

    const addIdeaDataBaseResult = await dataBaseConnection("POST", "../phpDataBase/IdeaDataBase.php", newIdea);

    if (addIdeaDataBaseResult === "Request is successful") {
        document.getElementById("add-idea-modal").style.display = "none";
        ModalManagement("Вашу ідею додано!", "#message-modal", "#close-modal-message", ideaForm);
    } else {
        console.log(addIdeaDataBaseResult);
    }
});