let leaderboardPage = document.getElementById('leaderboardPage')
let firstPage;
let user = {}
let openCards = []
let card = document.getElementsByClassName("card");
let cards = [...card];
let matchedCard = document.getElementsByClassName("match");
let scoreData = []
let game = document.getElementById("game");
let moves = 0
let map = {}
let instructions, deck, movesCounter;
// let showedElement = firstPage
// @description game timer
let second = 0,
  minute = 0;
hour = 0;
let timer;;
let interval;
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
document.body.onload = function () {
  movesCounter = document.querySelector(".moves");
  deck = document.getElementById("card-deck");
  timer = document.querySelector(".timer")
  for (let i = 0; i < 16; i++) {
    let type = window.crypto.getRandomValues(new Uint32Array(1))
    map[type[0]] = Math.floor(i / 2) + 1
    let div = document.createElement('div')
    div.classList.add('col-lg-1')
    div.classList.add('card')
    div.setAttribute("type", type);
    let img = document.createElement("img");
    img.classList.add('card-img')
    img.src = `raw/${Math.floor(i / 2) + 1}.png`;
    img.classList.add("hideImage");
    div.appendChild(img)
    deck.appendChild(div);
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
  startGame();
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
function saveData() {
  document.getElementById("submitBtn").disabled = true;
  // var formElement = document.querySelector("form").elements;
  // user.name = formElement[0].value
  // user.email = formElement[1].value
  user.name = 'chris'
  user.email = 'chris-test@gmail.com'
  startGame()
}
async function startGame() {
  // empty the openCards array
  openedCards = [];
  getHighScoreData()
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
  movesCounter.innerHTML = moves;
  //reset timer
  second = 0;
  minute = 0;
  hour = 0;
  var timer = document.querySelector(".timer");
  timer.innerHTML = "0 mins 0 secs";
  clearInterval(interval);

  // matchedCard = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]
  // user = { email: 'kris', score: 100 }
  // moves = 1000
  // congratulations()

}
function getHighScoreData() {
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://fb-api.ematicsolutions.com/elixus/customers", true);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.response)
      data = data.sort((a, b) => { return a.score - b.score })
      scoreData = data.slice(0, 5)
      // set high score
      let highScore = document.querySelector('.scoreToBeat')
      highScore.innerHTML = scoreData[0].score
    }
  };

}
function showLeaderBoard() {
  let userSelected = false
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
          node.innerHTML = `<p> <img style="width:40px" src="./raw/rank${i + 1}.png"></img> ${previewData[i].email} <img style="width:40px" src="./raw/buttons_icons-14.png"></img>${previewData[i].score}</p>`
          // node.innerHTML = `<p>${previewData[i].email}${previewData[i].score}</p>`
          if (previewData[i].email === user.email) {
            userSelected = true
            node.style.backgroundColor = 'crimson'
          }
          leaderboardList.appendChild(node);
        }
        if (user.score && userSelected === false) {
          let index = data.findIndex(el => el.email === user.email)
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

// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations() {
  if (matchedCard.length == 16) {
    clearInterval(interval);
    finalTime = timer.innerHTML;

    // declare star rating variable
    // var starRating = document.querySelector(".stars").innerHTML;

    //showing move, rating, time on modal
    // document.getElementById("finalMove").innerHTML = moves + " moves";
    // document.getElementById("score").innerHTML = moves * ((hour * 3600) + (minute * 60) + second);
    // document.getElementById("totalTime").innerHTML = finalTime;
    saveScore(moves * ((hour * 3600) + (minute * 60) + second), moves, timer.innerHTML)

    //closeicon on modal
    // closeModal();
  }
}
function saveScore(score, moves, time) {
  let name = localStorage.getItem('name')
  let email = localStorage.getItem('email')
  console.log('saveScore', score, moves, time)
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "https://fb-api.ematicsolutions.com/elixus/customers", true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify({
    email: email,
    score,
    name: name,
    moves,
    time
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.location.href = `congratulations.html?moves=${moves}&timer=${finalTime}`
    }
  };
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

    if (map[openedCards[0].getAttribute("type")] === map[openedCards[1].getAttribute("type")]) {
      matched();
    } else {
      unmatched();
    }
  }
}
// @description count player's moves
function moveCounter() {
  moves++;
  movesCounter.innerHTML = moves;
  //start timer on first click
  if (moves == 1) {
    second = 0;
    minute = 0;
    hour = 0;
    startTimer();
  }
  // // setting rates based on moves
  // if (moves > 8 && moves < 12) {
  //   for (i = 0; i < 3; i++) {
  //     if (i > 1) {
  //       stars[i].style.visibility = "collapse";
  //     }
  //   }
  // } else if (moves > 13) {
  //   for (i = 0; i < 3; i++) {
  //     if (i > 0) {
  //       stars[i].style.visibility = "collapse";
  //     }
  //   }
  // }
}
// @description when cards match
function matched() {
  openedCards[0].classList.add("match", "disabled");
  openedCards[1].classList.add("match", "disabled");
  openedCards[0].classList.remove("show", "open", "no-event");
  openedCards[1].classList.remove("show", "open", "no-event");
  openedCards = [];
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