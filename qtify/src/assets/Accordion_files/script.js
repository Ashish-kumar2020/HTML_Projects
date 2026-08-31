import { accordionData } from "./data.js";

console.log("Accordion Machine Coding Question");

const accordionContainer = document.querySelector(".accordion-container");


console.log(accordionData)

function createElement(tagName){
    const ele = document.createElement(tagName);
    return ele;
}

function init(){
    accordionData.map((ele) => {
        const parentContainer = createElement("div");
        const accordionTitle = createElement("button");
        const accordionDescription = createElement("p");
        accordionTitle.textContent = ele.title;
        accordionDescription.textContent = ele.content;
        accordionTitle.id = ele.id;
        accordionDescription.id = ele.id;
       
        accordionTitle.classList.add("accordion-title");
        accordionDescription.classList.add(".active")
        accordionTitle.addEventListener("click",() => {
            console.log("title clicked");
            accordionDescription.classList.add("accordion-description");
        })

        parentContainer.append(accordionTitle);
        parentContainer.append(accordionDescription);
        accordionContainer.append(parentContainer);
    });
}

init();
