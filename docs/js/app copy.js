// cards array holds all cards
let card = document.getElementsByClassName("card");
let cards = [...card];
let game = document.getElementById("game");
var data = {};
// deck of all cards in game
const deck = document.getElementById("card-deck");

// declaring move variable
let moves = 0;
let counter = document.querySelector(".moves");

// declare variables for star icons
const stars = document.querySelectorAll(".fa-star");

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

// stars list
let starsList = document.querySelectorAll(".stars li");

// close icon in modal
let closeicon = document.querySelector(".close");

// declare modal
let modal = document.getElementById("popup1");
let form = document.getElementById("form-popup");
let leaderboard = document.getElementById("leaderboard")
// array for opened cards
var openedCards = [];
var user = {}
let goBackBtn = document.getElementById("go-back-button")
function saveData() {
  document.getElementById("submitBtn").disabled = true;
  var formElement = document.querySelector("form").elements;
  user.name = formElement[0].value
  user.email = formElement[1].value
  form.classList.remove("show");
  startGame()
}
function saveScore(score) {
  console.log('saveScore', user)
  user.score = score
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://fb-api.ematicsolutions.com/elixus/customers", true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify({
    email: user.email,
    score,
    name: user.name
  }));
}
// @description shuffles cards
// @param {array}
// @returns shuffledarray
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// @description shuffles cards when page is refreshed / loads
document.body.onload = function () {
  for (let i = 0; i < 16; i++) {
    let node = document.createElement("li");
    node.classList.add("card");
    node.setAttribute("type", `${Math.floor(i / 2) + 1}.png`);
    let img = document.createElement("img");
    img.src = `raw/${Math.floor(i / 2) + 1}.png`;
    // img.style.height = "10rem";
    img.classList.add("hideImage");
    node.appendChild(img);
    deck.appendChild(node);
  }
  card = document.getElementsByClassName("card");
  cards = [...card];

  // loop to add event listeners to each card
  for (var i = 0; i < cards.length; i++) {
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click", congratulations);
  }
  // startGame();
};

// @description function to start a new play
function startGame() {
  // empty the openCards array
  openedCards = [];
  console.log("start game");

  // shuffle deck
  cards = shuffle(cards);
  // remove all exisiting classes from each card
  for (var i = 0; i < cards.length; i++) {
    deck.innerHTML = "";
    [].forEach.call(cards, function (item) {
      deck.appendChild(item);
    });
    cards[i].classList.remove("show", "open", "match", "disabled");
  }
  // reset moves
  moves = 0;
  counter.innerHTML = moves;
  // reset rating
  for (var i = 0; i < stars.length; i++) {
    stars[i].style.color = "#FFD700";
    stars[i].style.visibility = "visible";
  }
  //reset timer
  second = 0;
  minute = 0;
  hour = 0;
  var timer = document.querySelector(".timer");
  timer.innerHTML = "0 mins 0 secs";
  clearInterval(interval);
  game.classList.add("show");
  // matchedCard = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]
  // user = { email: 'kris', score: 100 }
  // moves = 1000
  // congratulations()

}

// @description toggles open and show class to display cards
var displayCard = function () {
  this.classList.toggle("open");
  this.classList.toggle("show");
  this.classList.toggle("disabled");
  this.childNodes[0].classList.remove("hideImage");
};

// @description add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
  openedCards.push(this);
  var len = openedCards.length;
  if (len === 2) {
    moveCounter();
    if (openedCards[0].type === openedCards[1].type) {
      matched();
    } else {
      unmatched();
    }
  }
}

// @description when cards match
function matched() {
  openedCards[0].classList.add("match", "disabled");
  openedCards[1].classList.add("match", "disabled");
  openedCards[0].classList.remove("show", "open", "no-event");
  openedCards[1].classList.remove("show", "open", "no-event");
  openedCards = [];
}

// description when cards don't match
function unmatched() {
  openedCards[0].classList.add("unmatched");
  openedCards[1].classList.add("unmatched");
  disable();
  setTimeout(function () {
    openedCards[0].classList.remove("show", "open", "no-event", "unmatched");
    openedCards[1].classList.remove("show", "open", "no-event", "unmatched");
    openedCards[0].childNodes[0].classList.add("hideImage");
    openedCards[1].childNodes[0].classList.add("hideImage");
    enable();
    openedCards = [];
  }, 1100);
}

// @description disable cards temporarily
function disable() {
  Array.prototype.filter.call(cards, function (card) {
    card.classList.add("disabled");
  });
}

// @description enable cards and disable matched cards
function enable() {
  Array.prototype.filter.call(cards, function (card) {
    card.classList.remove("disabled");
    for (var i = 0; i < matchedCard.length; i++) {
      matchedCard[i].classList.add("disabled");
    }
  });
}

// @description count player's moves
function moveCounter() {
  moves++;
  counter.innerHTML = moves;
  //start timer on first click
  if (moves == 1) {
    second = 0;
    minute = 0;
    hour = 0;
    startTimer();
  }
  // setting rates based on moves
  if (moves > 8 && moves < 12) {
    for (i = 0; i < 3; i++) {
      if (i > 1) {
        stars[i].style.visibility = "collapse";
      }
    }
  } else if (moves > 13) {
    for (i = 0; i < 3; i++) {
      if (i > 0) {
        stars[i].style.visibility = "collapse";
      }
    }
  }
}

// @description game timer
var second = 0,
  minute = 0;
hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer() {
  interval = setInterval(function () {
    timer.innerHTML = minute + "mins " + second + "secs";
    second++;
    if (second == 60) {
      minute++;
      second = 0;
    }
    if (minute == 60) {
      hour++;
      minute = 0;
    }
  }, 1000);
}

// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations() {
  console.log('congrats', matchedCard.length)
  if (matchedCard.length == 16) {
    clearInterval(interval);
    finalTime = timer.innerHTML;

    // show congratulations modal
    game.classList.remove("show");
    modal.classList.add("show");

    // declare star rating variable
    var starRating = document.querySelector(".stars").innerHTML;

    //showing move, rating, time on modal
    document.getElementById("finalMove").innerHTML = moves + " moves";
    document.getElementById("score").innerHTML = moves * ((hour * 3600) + (minute * 60) + second);
    document.getElementById("totalTime").innerHTML = finalTime;
    saveScore(moves * ((hour * 3600) + (minute * 60) + second))

    //closeicon on modal
    // closeModal();
  }
}
function showLeaderBoard() {
  console.log('show leaderboard')
  let userSelected = false
  modal.classList.remove("show");
  form.classList.remove('show')
  leaderboard.classList.add("show")
  console.log('showLeaderBoard', user)
  if (user.score) {
    goBackBtn.style.visibility = "true"
    goBackBtn.addEventListener('click', function (e) {
      modal.classList.add('show')
      leaderboard.classList.remove('show')
    })
  } else {
    goBackBtn.style.visibility = "hidden"
  }
  var xhttp = new XMLHttpRequest();
  let leaderboardList = document.getElementById("leaderboard-list")
  if (leaderboardList.childElementCount == 0) {
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(this.response)
        data = data.sort((a, b) => { return a.score - b.score })
        let previewData = data.slice(0, 5)
        for (let i = 0; i < previewData.length; i++) {
          let node = document.createElement("li");
          node.classList.add('leaderboard-score')
          node.innerHTML = `<span> ${i + 1}. ${previewData[i].email} - ${previewData[i].score}</span>`
          if (previewData[i].email === user.email) {
            userSelected = true
            node.style.backgroundColor = 'crimson'
          }
          leaderboardList.appendChild(node);
        }
        console.log('11', userSelected)
        if (user.score && userSelected === false) {
          let index = data.findIndex(el => el.email === user.email)
          console.log('data', data)
          console.log('index', index)
          let node = document.createElement("li");
          node.classList.add('leaderboard-score')
          node.innerHTML = `<span> ${index + 1}. ${data[index].email} - ${data[index].score}</span>`
          node.style.backgroundColor = 'crimson'
          leaderboardList.appendChild(node);

        }
      }
    };
    xhttp.open("GET", "https://fb-api.ematicsolutions.com/elixus/customers", true);
    xhttp.send();
  }

}
// @description close icon on modal
// function closeModal() {
//   closeicon.addEventListener("click", function (e) {
//     modal.classList.remove("show");
//     startGame();
//   });
// }

// @desciption for user to play Again
function playAgain() {
  modal.classList.remove("show");
  form.classList.add("show");
  startGame();
}
