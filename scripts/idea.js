import { buttonAddToList } from "./functions.js";

let idea = {
    id: 0,
    img: "../imgs/idea-img.jpg",
    name: "Not Found",
    author: "Not Found",
    price: 0,
    phone: "",
    description: "Not Found",
};

const user = parseInt(localStorage.getItem("user")) || 0;

const ideaString = sessionStorage.getItem('idea');

if (ideaString && ideaString !== "undefined") idea = JSON.parse(ideaString);

const ideaImg = document.querySelector(".idea-img");
const ideaName = document.querySelector('.idea-name');
const ideaAuthor = document.querySelector('.idea-author');
const ideaPhone = document.querySelector('.idea-phone');
const ideaPrice = document.querySelector('.idea-price');
const ideaDescription = document.querySelector('.idea-description-list');

ideaImg.setAttribute("src", idea.img);
ideaImg.setAttribute("alt", idea.name);

ideaName.textContent = idea.name;
ideaAuthor.textContent = `${idea.surname} ${idea.username}`;
ideaPhone.textContent = idea.phone;
ideaPrice.textContent = idea.price > 0 ? idea.price + " грн." : "Безкоштовно";

const description = idea.description.split("\n");

if (description) description.forEach(element => {
    const li = document.createElement('li');
    li.classList.add("idea-description-item");
    li.textContent = element;
    ideaDescription.append(li);
});

const ideaSelectedButton = document.querySelector(".idea-selected-button");

buttonAddToList({
    button: ideaSelectedButton,
    objectName: "idea",
    objectItemId: idea.id,
    user: user,
    path: "../phpDataBase/favouritesDatabase.php",
    messageItem: "Idea",
    messageList: "списку обраних",
    title: "Для додавання ідеї в обрані, будь ласка, авторизуйтеся!"
});