let row = document.querySelector(".row");
let viewScores = document.querySelector("#view-scores");
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
let hiscores = [];
let wrongAnswerDeduction = 10;
let timer;
let currentQuestion;
let countDown;
let cooldownDelay = 2000;

let clearRow = () => (row.innerHTML = "");

let putInRow = element => {
  clearRow();
  row.appendChild(element);
};

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
  button.addEventListener("click", function(event) {
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
      console.log(`Question index ${currentQuestion} incoming`);
      askQuestion();
    }, cooldownDelay);
  });
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
submitScore.addEventListener("click", function() {
  hiscores.push({ initials: enterInitials.value, score: timer });
  console.log({ initials: enterInitials.value, score: timer });
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
    countDown = setInterval(function() {
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
    let randomizeChoices = questions[currentQuestion]["choices"];
    for (let i = 0; i < 4; i++) {
      let randomIndex = Math.floor(Math.random() * randomizeChoices.length);
      buttons[i].innerHTML = questions[currentQuestion]["choices"][randomIndex];
      randomizeChoices.splice(randomIndex, 1);
    }
    console.log(`Choices provided`);
  } else {
    score.innerText = `Your score is ${timer}`;
    putInRow(results);
  }
};

// -----------------------------------------------------------------------------------------------------------
// ==================================== The function that starts the quiz ====================================
// -----------------------------------------------------------------------------------------------------------

let startQuiz = () => {
  putInRow(quiz);
  timer = 75;
  currentQuestion = 0;
  viewScores.classList.toggle("hide");
  askQuestion();
};

document.querySelector("#start-button").addEventListener("click", startQuiz);

// ----------------------------------------------------------------------------------------------------------------
// ==================================== The function that goes to the hiscores ====================================
// ----------------------------------------------------------------------------------------------------------------
