const userGrid = document.querySelector(".grid-user");
const computerGrid = document.querySelector(".grid-computer");
const displayGrid = document.querySelector(".grid-display");
const ships = document.querySelectorAll(".ship");
const destroyer = document.querySelector(".destroyer-container");
const submarine = document.querySelector(".submarine-container");
const carrier = document.querySelector(".carrier-container");
const battleship = document.querySelector(".battleship-container");
const cruiser = document.querySelector(".cruiser-container");
const startButton = document.querySelector("#start");
const rotateButton = document.querySelector("#rotate");
const turnDisplay = document.querySelector("#whose-go");
const infoDisplay = document.querySelector("#info");
let userSquares = [];
let computerSquares = [];
const width = 10;
let isHorizontal = true;
let noHorizontalOverflow;
let noVerticalOverflow;
let isGameOver = false;
let currentPlayer = "user";
let available = [];
//Create Boards

function createBoards(grid, squares) {
  for (let i = 0; i < 100; i++) {
    const square = document.createElement("div");
    square.dataset.id = i;
    square.dataset.row = Math.floor(i / 10);
    square.dataset.col = i % 10;

    square.textContent = i;
    grid.appendChild(square);
    squares.push(square);
  }
}

createBoards(userGrid, userSquares);
createBoards(computerGrid, computerSquares);

console.log(userSquares);

const shipArray = [
  {
    name: "destroyer",
    directions: [
      [0, 1],
      [0, width],
    ],
  },
  {
    name: "submarine",
    directions: [
      [0, 1, 2],
      [0, width, width * 2],
    ],
  },
  {
    name: "cruiser",
    directions: [
      [0, 1, 2],
      [0, width, width * 2],
    ],
  },
  {
    name: "battleship",
    directions: [
      [0, 1, 2, 3],
      [0, width, width * 2, width * 3],
    ],
  },
  {
    name: "carrier",
    directions: [
      [0, 1, 2, 3, 4],
      [0, width, width * 2, width * 3, width * 4],
    ],
  },
];

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.directions = this.createDirection();
  }

  createDirection() {
    let a = [];
    let b = [];
    for (var i = 0; i < this.length; i++) {
      a.push(i);
      b.push(10 * i);
    }

    return [a, b];
  }

  getName() {
    return this.name;
  }
  getDirections() {
    return this.directions;
  }
}

const newShipArray = [];

let objCarrier = new Ship("carrier", 5);
let objBattleShip = new Ship("battleship", 4);
let objSubmarine = new Ship("submarine", 3);
let objDestroyer = new Ship("destroyer", 2);
let objCruiser = new Ship("cruiser", 3);

newShipArray.push(
  objCruiser,
  objBattleShip,
  objCarrier,
  objSubmarine,
  objDestroyer
);

//Draw the computer ships

function generate(ship) {
  let randomDirection = Math.floor(Math.random() * ship.directions.length);
  let current = ship.directions[randomDirection];

  if (randomDirection === 0) direction = 1;
  if (randomDirection === 1) direction = 10;

  let randomStart = Math.floor(
    Math.random() *
      (computerSquares.length - ship.directions[0].length * direction)
  );

  //check if space to be occupied is empty;
  //some return a boolean value;
  const isTaken = current.some((index) =>
    computerSquares[randomStart + index].classList.contains("taken")
  );
  //check if random start + length of the  will over flow grid;
  const isAtRightEdge = current.some(
    (index) => (randomStart + index) % width === width - 1
  );
  const isAtLeftEdge = current.some(
    (index) => (randomStart + index) % width === 0
  );

  if (
    !isTaken &&
    ((!isAtLeftEdge && isAtRightEdge) ||
      (!isAtLeftEdge && !isAtRightEdge) ||
      (!isAtRightEdge && isAtLeftEdge))
  ) {
    current.forEach((index) =>
      computerSquares[randomStart + index].classList.add("taken", ship.name)
    );
  } else {
    generate(ship);
  }
}

generate(objCarrier);
generate(objSubmarine);
generate(objBattleShip);
generate(objCruiser);
generate(objDestroyer);

//Rotate Ships
function rotate() {
  ships.forEach((ship) => {
    ship.classList.toggle("vertical");
    displayGrid.classList.toggle("vertical");
  });

  isHorizontal = !isHorizontal;
  console.log(isHorizontal);
}

rotateButton.addEventListener("click", rotate);

//Move user Ships

ships.forEach((ship) => ship.addEventListener("dragstart", dragStart));
userSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("dragenter", dragEnter);
  square.addEventListener("dragleave", dragLeave);
  square.addEventListener("drop", dragDrop);
  square.addEventListener("dragend", dragEnd);
});

ships.forEach((ship) =>
  ship.addEventListener("mousedown", (e) => {
    selectShipNameWithIndex = e.target.id;
  })
);

let draggedShipLength;
let myNodeList;
function dragStart(e) {
  draggedShip = this;
  myNodeList = Array.from(draggedShip.childNodes);
  myNodeList = myNodeList.filter((node) => node.nodeName === "DIV");
  draggedShipLength = myNodeList.length;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
  let shipNameWithLastId = myNodeList[myNodeList.length - 1].id;
  let selectedShipIndex = parseInt(selectShipNameWithIndex.substr(-1));
  let shipLastId;
  let shipFirstId;
  let shipClass = shipNameWithLastId.slice(0, -2);
  let dropArea = [];
  let dropSafe;

  let safeToDrop;
  let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
  console.log(lastShipIndex);
  if (isHorizontal) {
    shipLastId = lastShipIndex + parseInt(this.dataset.id) - selectedShipIndex;
    shipFirstId = shipLastId - lastShipIndex;
    console.log("Horizontal: " + shipLastId);
  }

  if (!isHorizontal) {
    shipLastId = parseInt(
      parseInt(this.dataset.id) - selectedShipIndex * 10 + lastShipIndex * 10
    );
    shipFirstId = shipLastId - lastShipIndex * 10;
    console.log("vertical:" + shipLastId);
  }

  // shipLastId = shipLastId - selectedShipIndex;

  console.log("First id:" + shipFirstId);
  console.log("LastID: " + shipLastId);

  if (isHorizontal) {
    for (i = shipFirstId; i <= shipLastId; i++) {
      dropArea.push(i);
    }
  }

  if (!isHorizontal) {
    for (i = shipFirstId; i <= shipLastId; i += 10) {
      dropArea.push(i);
    }
  }

  console.log(dropArea);

  if (isHorizontal) {
    console.log(Math.floor(shipFirstId / 10));
    console.log(Math.floor(shipLastId / 10));
    noHorizontalOverflow =
      Math.floor(shipFirstId / 10) === Math.floor(shipLastId / 10);
    console.log(noHorizontalOverflow);
  } else if (!isHorizontal) {
    noVerticalOverflow =
      shipFirstId % 10 === shipLastId % 10 &&
      shipFirstId >= 0 &&
      shipLastId <= 99;
    console.log(noVerticalOverflow);
  }

  available = userSquares
    .filter((square) => !square.classList.contains("taken"))
    .map((square) => parseInt(square.dataset.id));

  dropSafe = dropArea.every((square) => available.includes(square));
  console.log(dropSafe);

  if (isHorizontal && noHorizontalOverflow && dropSafe) {
    /* for (let i = 0; i < draggedShipLength; i++) {
      userSquares[
        parseInt(this.dataset.id) - selectedShipIndex + i
      ].classList.add("taken", shipClass);
    } */
    dropArea.forEach((i) => userSquares[i].classList.add("taken", shipClass));
  } else if (!isHorizontal && noVerticalOverflow && dropSafe) {
    dropArea.forEach((i) => userSquares[i].classList.add("taken", shipClass));
  } else {
    return;
  }

  available = userSquares
    .filter((square) => !square.classList.contains("taken"))
    .map((square) => parseInt(square.dataset.id));
  console.log(available);

  displayGrid.removeChild(draggedShip);
}

function dragEnd() {}

//Game Logic

function playGame() {
  if (isGameOver) return;

  if (currentPlayer === "user") {
    turnDisplay.textContent = "Your Go";
    computerSquares.forEach((square) =>
      square.addEventListener("click", function (e) {
        if (currentPlayer === "user") revealSquare(square);
      })
    );
  } else {
    turnDisplay.textContent = "Computer's Turn";
    setTimeout(computerGo, 1700);
  }
}

startButton.addEventListener("click", playGame);

let destroyerCount = 0;
let carrierCount = 0;
let submarineCount = 0;
let cruiserCount = 0;
let battleshipCount = 0;

function revealSquare(square) {
  if (square.classList.contains("miss") || square.classList.contains("boom")) {
    console.log("already clicked");
    return;
  }
  if (square.classList.contains("destroyer")) destroyerCount++;
  if (square.classList.contains("submarine")) submarineCount++;
  if (square.classList.contains("carrier")) carrierCount++;
  if (square.classList.contains("battleship")) battleshipCount++;
  if (square.classList.contains("cruiser")) cruiserCount++;

  if (square.classList.contains("taken")) {
    square.classList.add("boom");
  } else {
    square.classList.add("miss");
  }

  currentPlayer = "computer";
  playGame();
}

let cpu_destroyerCount = 0;
let cpu_carrierCount = 0;
let cpu_submarineCount = 0;
let cpu_cruiserCount = 0;
let cpu_battleshipCount = 0;

function computerGo() {
  let random = Math.floor(Math.random() * userSquares.length);

  if (
    userSquares[random].classList.contains("miss") ||
    userSquares[random].classList.contains("boom")
  ) {
    console.log("already clicked");
    computerGo();
  }

  if (!userSquares[random].classList.contains("boom")) {
    if (userSquares[random].classList.contains("destroyer"))
      cpu_destroyerCount++;
    if (userSquares[random].classList.contains("submarine"))
      cpu_submarineCount++;
    if (userSquares[random].classList.contains("carrier")) cpu_carrierCount++;
    if (userSquares[random].classList.contains("battleship"))
      cpu_battleshipCount++;
    if (userSquares[random].classList.contains("cruiser")) cpu_cruiserCount++;

    if (userSquares[random].classList.contains("taken"))
      userSquares[random].classList.add("boom");
    else userSquares[random].classList.add("miss");
  } else computerGo();

  currentPlayer = "user";
  turnDisplay.textContent = "Your Go";
}

const isAvailable = (square) => {
  return available.includes(square);
};
