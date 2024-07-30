import { removeSpaces, saveElementInSession, searchByName, sortItems, dataBaseConnection } from "./functions.js";

import { ModalManagement, processingIdeaElements, handleIdeaForm } from "./modal.js";

const user = localStorage.getItem("user") || "";

const ideasList = document.querySelector(".ideas-list");

const ideas = await dataBaseConnection("GET", "../phpDatabase/allIdeaDataBase.php", undefined) || [];

if (ideas.length > 0) {
    ideas.forEach((element) => {
        const li = document.createElement("li");
        li.classList.add("idea-list-item");
        li.setAttribute("data-id", element.id);
        li.innerHTML = `<a href="./idea.html"
                    ><img
                        src=${element.img}
                        alt=${element.name}
                        class="idea-img"
                    />
                    <div class="idea-information">
                        <h3 class="idea-name">${element.name}</h3>
                        <p class="idea-author">${element.username} ${element.surname}</p>
                        <p class="idea-price">${element.price > 0 ? element.price + " €" : "Free"} </p>
                    </div>
                </a>`;
        ideasList.append(li);
    });
}

const ideasListItem = document.querySelectorAll(".idea-list-item");

if (ideasList) ideasList.addEventListener("click", (evt) => saveElementInSession(evt, ".idea-list-item", ideas, "idea"));

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
        ModalManagement("", "#add-idea-modal", "#close-modal-idea", 0);
        document.querySelector("#idea-form").reset();
    } else {
        ModalManagement("To add an idea, please log in!", "#message-modal", "#close-modal-message", 0);
    }
});

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
    modalDescription: modalDescription,
});

const ideaForm = document.getElementById("idea-form");

if (ideaForm) ideaForm.addEventListener("submit", handleIdeaForm({
    modalImageUrl: modalImageUrl,
    modalName: modalName,
    modalIdeaPrice: modalIdeaPrice,
    modalPhoneIdea: modalPhoneIdea,
    modalDescription: modalDescription,
    ideaForm: ideaForm,
    ideaID: "",
    ideaUser: user,
    formID: "add-idea-modal",
    messageAction: "added",
}));