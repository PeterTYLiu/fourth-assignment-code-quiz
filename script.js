let row = document.querySelector(".row");
let time = document.querySelector("#time");
let questions = [
  {
    question: "What is an array?",
    choices: [
      "A dessert",
      "An Australian marsupial",
      "A car",
      "A data structure"
    ],
    answer: "A data structure"
  },
  {
    question: "How do you declare a variable?",
    choices: [
      "Using pliers",
      "Using 'var'",
      "With the binomial theorem",
      "With your parents' money"
    ],
    answer: "Using 'var'"
  },
  {
    question: "What is Javascript?",
    choices: [
      "A Jerry Bruckheimer movie",
      "One of the Lil' Rascals",
      "A rare Indian herb",
      "A programming language"
    ],
    answer: "A programming language"
  },
  {
    question: "What is a method?",
    choices: [
      "The president of Madagascar",
      "A type of plum",
      "The 4th Dalai Lama",
      "A function of an object"
    ],
    answer: "A function of an object"
  },
  {
    question: "What is a loop?",
    choices: [
      "My favorite rollercoaster",
      "A french wolf",
      "A lying goop",
      "A re-executing function"
    ],
    answer: "A re-executing function"
  }
];
let hiscores = localStorage.hiscores ? JSON.parse(localStorage.hiscores) : [];
let wrongAnswerDeduction = 10;
let timer;
let currentQuestion;
let countDown;
let cooldownDelay = 3000;

let clearRow = () => (row.innerHTML = "");

let putInRow = element => {
  clearRow();
  row.appendChild(element);
};

let viewScores = document.querySelector("#view-scores");

// ------------------------------------------------------------------------------------------------------
// ==================================== Creating the home DOM object ====================================
// ------------------------------------------------------------------------------------------------------

let home = document.createElement("div");
home.classList.add("column");
home.setAttribute("style", "text-align: center;");

let homeTitle = document.createElement("h1");
homeTitle.innerText = "Coding Quiz";
home.appendChild(homeTitle);

let homeIntro = document.createElement("p");
homeIntro.innerHTML = "You code good? Answer questions! Wrong answer minus 10.";
home.appendChild(homeIntro);

let startQuizButton = document.createElement("button");
startQuizButton.innerText = "Start quiz";
startQuizButton.classList.add("button-primary");
home.appendChild(startQuizButton);

// Initializes on the home page
putInRow(home);

// ------------------------------------------------------------------------------------------------------
// ==================================== Creating the quiz DOM object ====================================
// ------------------------------------------------------------------------------------------------------

let quiz = document.createElement("div");
quiz.classList.add("column");

let questionNumber = document.createElement("h6");
quiz.appendChild(questionNumber);

let question = document.createElement("h2");
quiz.appendChild(question);

let buttons = [];

for (let i = 0; i < 4; i++) {
  buttons[i] = document.createElement("button");
  buttons[i].setAttribute("id", "choice" + (i + 1));
  buttons[i].classList.add("button-primary", "choice");
  quiz.appendChild(buttons[i]);
}

let result = document.createElement("h4");
quiz.appendChild(result);

let cooldown = [];

for (let i = 0; i < 5; i++) {
  cooldown[i] = document.createElement("div");
  cooldown[i].classList.add("cooldown");
  quiz.appendChild(cooldown[i]);
}

// -------------------------------------------------------------------------------------------------------------
// ==================================== Creating event listener for choices ====================================
// -------------------------------------------------------------------------------------------------------------

buttons.forEach(button => {
  button.addEventListener("click", event => {
    // What happens if you choose the WRONG answer
    if (event.currentTarget.innerHTML != questions[currentQuestion]["answer"]) {
      event.currentTarget.classList.add("incorrect");
      if (timer > 9) {
        timer -= wrongAnswerDeduction;
      } else {
        timer = 0;
      }
      result.innerHTML = "Wrong! -10s";
      console.log(`Wrong!`);
    } else {
      result.innerHTML = "Correct!";
      console.log(`Correct!`);
    }

    // Regardless of what you answer, you are told the right answer, and given a few seonds before the next question.
    // During this time, buttons are not clickable.
    document.querySelectorAll(".choice").forEach(thing => {
      if (thing.innerHTML == questions[currentQuestion]["answer"]) {
        thing.classList.add("correct");
      }
      thing.classList.add("unclickable");
    });

    clearInterval(countDown);
    time.innerHTML = `Time remaining: ${timer} s`;
    currentQuestion++;
    console.log(
      `Timer stopped, currentQuestion incremented to ${currentQuestion}`
    );

    // Runs a colldown for 5 seconds
    cooldown.forEach(dot => {
      dot.setAttribute("style", "background: #33C3F0");
    });
    console.log(`Cooldown started`);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        cooldown[i].setAttribute("style", "background: lightgrey");
      }, (cooldownDelay / 5) * (i + 1));
    }
    // Asks the next question after 5 seconds
    setTimeout(() => {
      askQuestion();
    }, cooldownDelay);
  });
});

// ----------------------------------------------------------------------------------------------------------
// ==================================== Creating the hiscores DOM object ====================================
// ----------------------------------------------------------------------------------------------------------

let hiscoresPage = document.createElement("div");
hiscoresPage.classList.add("column");

let hiscoresTitle = document.createElement("h2");
hiscoresTitle.innerText = "Hiscores";
hiscoresPage.appendChild(hiscoresTitle);

let hiscoresContent = document.createElement("div");
hiscoresPage.appendChild(hiscoresContent);

// ----------------------------------------------------------------------------------------------------------------
// ==================================== The function that goes to the hiscores ====================================
// ----------------------------------------------------------------------------------------------------------------

let goToHiscores = () => {
  time.classList.add("hide");
  viewScores.classList.add("hide");
  hiscoresContent.innerHTML = null;
  putInRow(hiscoresPage);
  if (hiscores.length == 0) {
    let noHiscores = document.createElement("p");
    noHiscores.innerHTML = "There are no hiscores!";
    hiscoresContent.appendChild(noHiscores);
  } else {
    let hiscoresTable = document.createElement("table");
    let tableHeader = document.createElement("tr");
    let tableNames = document.createElement("th");
    tableNames.innerHTML = "NAME";
    tableHeader.appendChild(tableNames);
    let tableScores = document.createElement("th");
    tableScores.innerHTML = "SCORE";
    tableHeader.appendChild(tableScores);
    hiscoresTable.appendChild(tableHeader);

    let sortedHiscores = hiscores.sort((a, b) => {
      return b["score"] - a["score"];
    });

    console.log(sortedHiscores);

    hiscores.forEach(entry => {
      let entryRow = document.createElement("tr");
      let entryName = document.createElement("td");
      entryName.innerHTML = entry["initials"];
      entryRow.appendChild(entryName);
      let entryScore = document.createElement("td");
      entryScore.innerHTML = entry["score"];
      entryScore.setAttribute("style", "text-align: right");
      entryRow.appendChild(entryScore);
      hiscoresTable.appendChild(entryRow);
    });

    hiscoresContent.appendChild(hiscoresTable);

    let clearHiscores = document.createElement("button");
    clearHiscores.innerHTML = "Clear hiscores";
    hiscoresContent.appendChild(clearHiscores);

    clearHiscores.addEventListener("click", () => {
      hiscores = [];
      localStorage.setItem("hiscores", JSON.stringify(hiscores));
      goToHiscores();
    });
  }
  let goHome = document.createElement("button");
  goHome.classList.add("button-primary");
  goHome.innerHTML = "Home";
  hiscoresContent.appendChild(goHome);

  goHome.addEventListener("click", () => {
    viewScores.classList.remove("hide");
    putInRow(home);
  });
};

viewScores.addEventListener("click", () => {
  goToHiscores();
});

// ---------------------------------------------------------------------------------------------------------
// ==================================== Creating the results DOM object ====================================
// ---------------------------------------------------------------------------------------------------------

let results = document.createElement("div");
results.classList.add("column");

let score = document.createElement("h4");
results.appendChild(score);

let initialsLabel = document.createElement("label");
initialsLabel.setAttribute("for", "initials");
initialsLabel.innerHTML = "Enter your initials";
results.appendChild(initialsLabel);

let enterInitials = document.createElement("input");
enterInitials.setAttribute("id", "initials");
results.appendChild(enterInitials);

let submitScore = document.createElement("button");
submitScore.classList.add("button");
submitScore.innerHTML = "Submit";
submitScore.addEventListener("click", () => {
  if (enterInitials.value) {
    hiscores.push({ initials: enterInitials.value, score: timer });
    localStorage.setItem("hiscores", JSON.stringify(hiscores));
    enterInitials.value = "";
    initialsLabel.classList.remove("warning");
    goToHiscores();
  } else {
    initialsLabel.classList.add("warning");
  }
});
results.appendChild(submitScore);

// -------------------------------------------------------------------------------------------------------------
// ==================================== The function that asks the question ====================================
// -------------------------------------------------------------------------------------------------------------

let askQuestion = () => {
  if (timer > 0 && currentQuestion < questions.length) {
    console.log(
      `Question index ${currentQuestion}: ${questions[currentQuestion]["question"]}`
    );
    // Clear styles from the previous question
    result.innerHTML = null;
    cooldown.forEach(dot => {
      dot.setAttribute("style", "background: #FFFFFF00;");
    });
    document.querySelectorAll(".choice").forEach(button => {
      button.classList.remove("correct", "incorrect", "unclickable");
    });

    // Starts the countdown timer
    countDown = setInterval(() => {
      if (timer > 0) {
        timer--;
        time.innerHTML = `Time remaining: ${timer} s`;
      }
    }, 1000);
    console.log(`Countdown started`);
    // Insert the question number into the H6 tag
    questionNumber.innerHTML = `Question ${currentQuestion + 1} of ${
      questions.length
    }`;

    // Insert the question into the H2 tag
    question.innerHTML = questions[currentQuestion]["question"];
    console.log(`Question asked`);

    // Inserts the question choices into the buttons in random order
    let randomizeChoices = questions[currentQuestion]["choices"].slice();
    console.log(randomizeChoices);
    for (let i = 0; i < 4; i++) {
      let randomIndex = Math.floor(Math.random() * randomizeChoices.length);
      console.log(randomIndex);
      buttons[i].innerHTML = randomizeChoices[randomIndex];
      console.log([randomizeChoices][randomIndex]);
      randomizeChoices.splice(randomIndex, 1);
      console.log(randomizeChoices);
    }
  } else {
    score.innerText = `Your score is ${timer}`;
    putInRow(results);
    time.classList.add("hide");
  }
};

// -----------------------------------------------------------------------------------------------------------
// ==================================== The function that starts the quiz ====================================
// -----------------------------------------------------------------------------------------------------------

let startQuiz = () => {
  putInRow(quiz);
  time.classList.remove("hide");
  timer = 75;
  currentQuestion = 0;
  viewScores.classList.toggle("hide");
  askQuestion();
};

startQuizButton.addEventListener("click", startQuiz);
