const players = ['B', 'W'];
const labels = ["Black", "White"];

let board, counts, available, lastPlay, currentPlayer;

let human = [true, false];
let levelAI = [6, 6];

let w, h;
let list, winp;
let inSettings = false;
let clickSettings = false;

let layer, dialog;

function restart() {
  board = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', 'A', 'A', 'A', 'A', '', ''],
    ['', '', 'A', 'W', 'B', 'A', '', ''],
    ['', '', 'A', 'B', 'W', 'A', '', ''],
    ['', '', 'A', 'A', 'A', 'A', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
  ];
  counts = [2, 2];
  lastPlay = [-1, -1]
  available = [];
  currentPlayer = 0;
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      if (board[i][j] == 'A') {
        available.push([i, j]);
      }
    }
  }
  if (!human[currentPlayer]) {
    setTimeout(nextTurn, 500);
  }
  list.html("");
  win.html("");
}

let sliderLevel = [];
let checkbox = [];
let slider = [];

function sliderChange() {
  for (let i = 0; i < slider.length; i++) {
    sliderLevel[i].html(slider[i].value());
  }
}

function settings() {
  layer = createDiv();
  layer.position(0, 0);
  layer.size(w * 12, h * 12);
  layer.style("background-color", "gray");
  layer.style("opacity", "0.75");

  dialog = createDiv();
  dialog.position(w, h * 2);
  dialog.size(w * 7, h * 5);
  dialog.style("border", "black 2px solid");
  dialog.style("background-color", "white");
  dialog.style("box-sizing", "border-box");
  dialog.style("font-family", "monospace");
  dialog.style("font-size", "20pt");
  dialog.style("padding", "4px");
  for (let i = 0; i < human.length; i++) {
    let label = createSpan(labels[i]);
    dialog.child(label)
    checkbox[i] = createCheckbox("Human", human[i]);
    dialog.child(checkbox[i]);
    let level = createSpan("AI level: ");
    dialog.child(level);
    slider[i] = createSlider(1, 8, levelAI[i]);
    slider[i].input(sliderChange);
    dialog.child(slider[i]);
    sliderLevel[i] = createSpan(slider[i].value());
    sliderLevel[i].style("margin-left", "4px");
    dialog.child(sliderLevel[i]);

    if (i == 0) {
      let hr = createElement("hr");
      dialog.child(hr);
    }
  }
  inSettings = true;
  clickSettings = true;
}

function setup() {
  createCanvas(450, 450);

  frameRate(30);
  w = width / 9;
  h = height / 9;

  list = createDiv();
  list.position(460, h / 2);
  list.size(75, h * 8);
  list.style("border", "black 2px solid");
  list.style("padding", "4px");
  list.style("box-sizing", "border-box");
  list.style("font-family", "monospace");
  list.style("font-size", "16pt");
  list.style("overflow-y", "scroll");

  win = createDiv();
  win.style("font-size", "32pt");
  win.position(h / 2, height);

  let restartButton = createButton("Restart");
  restartButton.position(h / 2, height + 48);
  restartButton.mousePressed(restart);
  restartButton.style("font-size", "24pt");

  let settingsButton = createButton("Settings");
  settingsButton.position(h / 2 + 120, height + 48);
  settingsButton.mousePressed(settings);
  settingsButton.style("font-size", "24pt");


  restart();
}

function hasAvailablePlayer(player) {
  for (let spot of available) {
    if (isAvailablePlayer(spot[0], spot[1], player)) {
      return true;
    }
  }
  return false;
}

function countAvailablePlayer(player) {
  let count = 0;
  for (let spot of available) {
    if (isAvailablePlayer(spot[0], spot[1], player)) {
      count++;
    }
  }
  return count;
}

function isAvailablePlayer(i, j, player) {
  let otherPlayer = players[player ^ 1];
  player = players[player];
  for (let dj = -1; dj <= 1; dj++) {
    for (let di = -1; di <= 1; di++) {
      if (di || dj) {
        let k = 1;
        while (boardAt(i + di * k, j + dj * k) == otherPlayer) {
          k++;
        }
        if ((k > 1) && (boardAt(i + di * k, j + dj * k) == player)) {
          return true;
        }
      }
    }
  }
  return false;
}

function addList(text) {
  let div = createDiv(text);
  list.child(div);
  list.elt.scrollTop = list.elt.scrollHeight;
}

function play(i, j) {
  playAt(i, j, currentPlayer);
  lastPlay[0] = i;
  lastPlay[1] = j;
  addList(String.fromCharCode(i + 97) + (j + 1));
}

function pass() {
  addList("pass");
}

function playAt(i, j, player) {
  addPawn(i, j, player);
  let otherPlayer = players[player ^ 1];
  for (let dj = -1; dj <= 1; dj++) {
    for (let di = -1; di <= 1; di++) {
      if (di || dj) {
        let k = 1;
        while (boardAt(i + di * k, j + dj * k) == otherPlayer) {
          k++;
        }
        if ((k > 1) && (boardAt(i + di * k, j + dj * k) == players[player])) {
          while (k > 1) {
            k--;
            reversePawn(i + di * k, j + dj * k, player);
          }
        }
      }
    }
  }
}

function boardAt(i, j) {
  if ((i >= 0) && (i < 8) && (j >= 0) && (j < 8)) {
    return board[i][j];
  }
  return null;
}

function addPawn(i, j, player) {
  board[i][j] = players[player];
  counts[player]++;
  for (let dj = -1; dj <= 1; dj++) {
    let j2 = j + dj;
    for (let di = -1; di <= 1; di++) {
      if (di || dj) {
        let i2 = i + di;
        if (boardAt(i2, j2) === '') {
          available.push([i2, j2]);
          board[i2][j2] = 'A';
        }
      }
    }
  }
}

function reversePawn(i, j, player) {
  board[i][j] = players[player];
  counts[player]++;
  counts[player ^ 1]--;
}

function checkWinner() {
  if ((available.length == 0) || (!hasAvailablePlayer(0) && !hasAvailablePlayer(1))) {
    if (counts[0] > counts[1]) {
      return 'Black wins';
    } else if (counts[1] > counts[0]) {
      return 'White wins';
    } else {
      return 'Tie!';
    }
  }
  return null;
}

function randomAI() {
  let index;
  do {
    index = floor(random(available.length));
    const spot = available[index];
    i = spot[0];
    j = spot[1];
  } while (!isAvailablePlayer(i, j, currentPlayer));
  return index;
}

function corners(player) {
  let stable = [];
  player = players[player];
  let m = 7;
  for (let j = 0; j < 7; j++) {
    for (let i = 0; i < m; i++) {
      if (board[i][j] != player) {
        m = i;
        break;
      } else {
        stable[i * 8 + j] = true;
      }
    }
    if (m == 0) {
      break;
    }
  }

  m = 7;
  for (let j = 7; j > 0; j--) {
    for (let i = 0; i < m; i++) {
      if (board[i][j] != player) {
        m = i;
        break;
      } else {
        stable[i * 8 + j] = true;
      }
    }
    if (m == 0) {
      break;
    }
  }

  m = 0;
  for (let j = 0; j < 7; j--) {
    for (let i = 7; i > m; i--) {
      if (board[i][j] != player) {
        m = i;
        break;
      } else {
        stable[i * 8 + j] = true;
      }
    }
    if (m == 7) {
      break;
    }
  }

  m = 0;
  for (let j = 7; j > 0; j--) {
    for (let i = 7; i > m; i--) {
      if (board[i][j] != player) {
        m = i;
        break;
      } else {
        stable[i * 8 + j] = true;
      }
    }
    if (m == 7) {
      break;
    }
  }
  return stable.filter(s => s).length;
}

function evaluateBoard(player) {
  return (corners(player) - corners(player ^ 1)) * 10000 + (countAvailablePlayer(player) - countAvailablePlayer(player ^ 1)) * 100 + (counts[player] - counts[player ^ 1]);
}

function minimaxAI(player, level, next) {
  if ((available.length == 0) || (!hasAvailablePlayer(0) && !hasAvailablePlayer(1))) {
    if (counts[player] > counts[player ^ 1]) {
      return 1000000 + counts[player];
    } else if (counts[player ^ 1] > counts[player]) {
      return -1000000 - counts[player ^ 1];
    } else {
      return 0;
    }
  } else if (level == 0) {
    return evaluateBoard(player);
  }

  let compare;
  let minmax;
  let index = -1;
  if (player == currentPlayer) {
    compare = (a, b) => (a > b);
    minmax = -Infinity;
  } else {
    compare = (a, b) => (a < b);
    minmax = Infinity;
  }

  let saveAvailable = [...available];
  let saveBoard = board.map(row => row.slice(0)); // Deep copy
  let saveCounts = [...counts];

  for (let spotIndex = 0; spotIndex < saveAvailable.length; spotIndex++) {
    let spot = saveAvailable[spotIndex];
    let i = spot[0];
    let j = spot[1];
    if (isAvailablePlayer(i, j, player)) {
      available.splice(spotIndex, 1);
      playAt(i, j, player);
      let score = minimaxAI(player ^ 1, level - 1, true);
      if (compare(score, minmax)) {
        minmax = score;
        index = spotIndex;
      }
      available = [...saveAvailable];
      board = saveBoard.map(row => row.slice(0)); // Deep restore
      counts = [...saveCounts];
    }
  }
  if (next) {
    if (index >= 0) {
      return minmax;
    } else {
      return minimaxAI(player ^ 1, level - 1, true);
    }
  }
  return index;
}

function alphabetaAI(player, level, alpha, beta, next) {
  if ((available.length == 0) || (!hasAvailablePlayer(0) && !hasAvailablePlayer(1))) {
    if (counts[player] > counts[player ^ 1]) {
      return 1000000 + counts[player];
    } else if (counts[player ^ 1] > counts[player]) {
      return -1000000 - counts[player ^ 1];
    } else {
      return 0;
    }
  } else if (level == 0) {
    return evaluateBoard(player);
  }

  let compare, cut, alphabeta;
  let minmax;
  let index = -1;
  if (player == currentPlayer) {
    compare = (a, b) => (a > b);
    cut = (v) => v >= beta;
    alphabeta = (v) => alpha = max(alpha, v);
    minmax = -Infinity;
  } else {
    compare = (a, b) => (a < b);
    cut = (v) => alpha >= v;
    alphabeta = (v) => beta = min(beta, v);
    minmax = Infinity;
  }

  let saveAvailable = [...available];
  let saveBoard = board.map(row => row.slice(0)); // Deep copy
  let saveCounts = [...counts];

  for (let spotIndex = 0; spotIndex < saveAvailable.length; spotIndex++) {
    let spot = saveAvailable[spotIndex];
    let i = spot[0];
    let j = spot[1];
    if (isAvailablePlayer(i, j, player)) {
      available.splice(spotIndex, 1);
      playAt(i, j, player);
      let score = alphabetaAI(player ^ 1, level - 1, alpha, beta, true);
      if (compare(score, minmax)) {
        minmax = score;
        index = spotIndex;
      }
      available = [...saveAvailable];
      board = saveBoard.map(row => row.slice(0)); // Deep restore
      counts = [...saveCounts];
      if (cut(score)) {
        break;
      }
      alphabeta(score);
    }
  }
  if (next) {
    if (index >= 0) {
      return minmax;
    } else {
      return alphabetaAI(player ^ 1, level - 1, alpha, beta, true);
    }
  }
  return index;
}

function nextTurn() {
  if (inSettings) {
    return;
  }
  
  let notAvailable = false;
  if (hasAvailablePlayer(currentPlayer)) {
    if (human[currentPlayer]) {
      return;
    }
    //let index = randomAI();
    //let index = minimaxAI(currentPlayer, levelAI[currentPlayer], false);

    available.sort(() => Math.random() - 0.5);

    let index = alphabetaAI(currentPlayer, levelAI[currentPlayer], -Infinity, Infinity, false);
    let spot = available.splice(index, 1)[0];
    let i = spot[0];
    let j = spot[1];
    play(i, j);
  } else {
    notAvailable = true;
  }

  let result = checkWinner();
  if (result != null) {
    win.html(`${result} ${max(counts)} - ${min(counts)}`);
  } else {
    if (notAvailable) {
      pass();
    }
    currentPlayer = currentPlayer ^ 1;
    if (!human[currentPlayer] || !hasAvailablePlayer(currentPlayer)) {
      setTimeout(nextTurn, 500);
    }
  }
}

function mouseReleased() {
  if (clickSettings) {
    clickSettings = false;
  } else if (inSettings) {
    if ((mouseX >= w) && (mouseX < w * 8) && (mouseY >= h * 2) && (mouseY <= h * 7)) {} else {
      for (let i = 0; i < slider.length; i++) {
        levelAI[i] = slider[i].value();
      }
      for (let i = 0; i < checkbox.length; i++) {
        human[i] = checkbox[i].checked();
      }

      layer.remove();
      dialog.remove();
      inSettings = false;
      nextTurn();
    }
  }
}

function mousePressed(event) {
  if (inSettings) {
    return;
  }
  if (human[currentPlayer]) {
    let i = floor((mouseX - w / 2) / w);
    let j = floor((mouseY - h / 2) / h);
    if ((i >= 0) && (i < 8) && (j >= 0) && (j < 8)) {
      let index = available.findIndex(spot => spot[0] == i && spot[1] == j);
      if (index >= 0) {
        if (isAvailablePlayer(i, j, currentPlayer)) {
          available.splice(index, 1);
          play(i, j);
          currentPlayer = currentPlayer ^ 1;
          setTimeout(nextTurn, 500);
        }
      }
    }
  }
}

function draw() {
  background(255);

  rectMode(CORNER);
  fill(0);
  noStroke();
  textSize(h * 0.4);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < 8; i++) {
    text(i + 1, w / 4, h * i + h);
    text(i + 1, width - w / 4, h * i + h);

    text(String.fromCharCode(i + 97), w * i + w, h / 4);
    text(String.fromCharCode(i + 97), w * i + w, height - h / 4);
  }

  rectMode(CENTER)
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      let x = w * i + w;
      let y = h * j + h;
      let spot = board[i][j];
      if (spot === '') {
        fill(0, 100, 0);
      } else {
        fill(0, 158, 11);
      }
      strokeWeight(2);
      stroke(0);
      rect(x, y, w, h);
      if (spot === players[0]) {
        fill(0);
        noStroke();
        ellipse(x, y, w * 0.75);
      } else if (spot === players[1]) {
        fill(255);
        noStroke();
        ellipse(x, y, w * 0.75);
      } else if ((spot === 'A') && human[currentPlayer] && (isAvailablePlayer(i, j, currentPlayer))) {
        if (players[currentPlayer] == 'B') {
          fill(0);
        } else {
          fill(255);
        }
        noStroke();
        ellipse(x, y, w * 0.1);
      }

      if (i == lastPlay[0] && j == lastPlay[1]) {
        strokeWeight(1);
        stroke(255, 0, 0);
        noFill();
        ellipse(x, y, w * 0.75);
      }
    }
  }
}