console.log("Script FIle Loaded");

// let h1Element = document.getElementsByTagName("h1");
// console.log(h1Element[0].textContent)

const divElem = document.getElementById("facts-list");
const tableDiv = document.querySelector("#table-div");
const showTable = document.querySelector("button");
const p1 = document.createElement("p");
p1.innerText = "innerText property refers to the text inside an element";

divElem.appendChild(p1);

function addNewFact(factText) {
  const pElement = document.createElement("p");
  pElement.innerText = factText;
  divElem.appendChild(pElement);
}
addNewFact("innerText property refers to the text inside an element");
addNewFact("append() or appendChild() methods can add a new child element");

function editText(fact) {
  const fact1 = document.getElementById("fact-1");
  const fact2 = document.getElementById("fact-2");
  fact1.innerText = fact;
  fact2.innerHTML = fact;
}

function getStyledTable() {
  let table = document.createElement("table");
  table.setAttribute("border", "solid");
  table.setAttribute("width", "400px");
  return table;
}

function getTableHeader() {
  let thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
        <th>Id</th>
        <th>Name</th>
    </tr>
  `;
  return thead;
}

function getStudentTableRow(id, name) {
  let tRow = document.createElement("tr");
  tRow.innerHTML = `
    <td>${id}</td>
    <td>${name}</td>
  `;
  return tRow;
}

function loadTableRefactored() {
  let table = getStyledTable();
  let thead = getTableHeader();
  table.append(thead);
  let tbody = document.createElement("tbody");
  let tRow = getStudentTableRow("1", "Ramesh");
  tbody.appendChild(tRow);
  table.appendChild(tbody);
  tableDiv.append(table);
}

// loadTableRefactored();

console.log(students);
function loadTableFromJSON() {
  let table = getStyledTable();
  let thead = getTableHeader();
  table.append(thead);
  let tbody = document.createElement("tbody");
  for (let i = 0; i < students.length; i++) {
    let currentStudent = students[i];
    let tRow = getStudentTableRow(currentStudent.id, currentStudent.name);
    tbody.appendChild(tRow);
  }

  table.appendChild(tbody);
  tableDiv.append(table);
}

showTable.addEventListener("click",function(){

    loadTableFromJSON();
})

