import { loadHTML } from "./pageLoader.js";

window.onload = () => loadHTML('header', 'header.html');

import { dataBaseConnection } from "./functions.js";

const user = parseInt(localStorage.getItem("user")) || 0;

const questionnaireButton = document.querySelector(".questionnaire-button");

let questionnaire = {};

const filter = [];

if (questionnaireButton) questionnaireButton.addEventListener("click", async function (evt) {
    evt.preventDefault();

    questionnaire = {
        user: user,
    };

    radioButton("receiver");
    radioButton("age");
    radioButton("occasion");
    radioButton("interests");

    await dataBaseConnection("POST", "../phpDataBase/questionnaireDatabase.php", questionnaire);

    sessionStorage.setItem("filter", JSON.stringify(filter));

    sessionStorage.setItem("clickedButton", "true");

    window.location.href = "./shop.html";
});

function radioButton(buttonName) {
    const radioButtons = document.querySelectorAll(`input[type="radio"][name=${buttonName}]`);

    let selectedRadioButton;

    radioButtons.forEach((radioButton) => {
        if (radioButton.checked) {
            selectedRadioButton = radioButton;
        }
    });

    const selectedValue = selectedRadioButton.value;
    const selectedText = selectedRadioButton.nextSibling.textContent.trim();

    switch (buttonName) {
        case "receiver":
            filter[0] = selectedValue;
            break;
        case "age":
            filter[1] = selectedValue;
            break;
        case "occasion":
            filter[2] = selectedValue;
            break;
        case "interests":
            filter[3] = selectedValue;
            break;
        default:
            console.log("Жодна радіокнопка не вибрана");
            break;
    }

    questionnaire[buttonName] = (selectedText === "Інше" ? "-" : selectedText);
}