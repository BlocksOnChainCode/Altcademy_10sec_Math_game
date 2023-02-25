/**
 * ! :
 * ? :
 * TODO : 
 * 
 */

// hide both the game and highscore container using JQuery hide()
let timerValue = 10;
let timerInterval;
const timer = $('#timer');

$("#game-container").hide();
$("#highScore-container").hide();

function startTimer() {
  console.log('timer started')
  timerInterval = setInterval(() => {
    if (timerValue <= 0) {
      clearInterval(timerInterval);
      endGame();
    } else {
      console.log(timer)
      timerValue--;
      timer.html(`Time left: ${timerValue}s`);
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  $('#game-container').hide();
  $('#highScore-container').show();
}

let playBtn = $('#play-button');
playBtn.click(() => {
  $("#home-container").slideToggle(1000);
  $("#game-container").fadeIn(1000);
  startTimer();
  generateEquation();
});


function addTime() {
  timerValue++;
  timer.textContent = `Time left: ${timerValue}s`;
}

function getRandomNumber() {
  return Math.floor(Math.random() * 10) + 1;
}

function getRandomOperator() {
  const operators = ['+', '-', '*', '/'];
  const randomIndex = Math.floor(Math.random() * operators.length);
  return operators[randomIndex];
}

function generateEquation() {
  let num1, num2, operator, answer;

  do {
    num1 = getRandomNumber();
    num2 = getRandomNumber();
    operator = getRandomOperator();

    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      case '/':
        answer = num1 / num2;
        break;
    }
  } while ((answer < 0) || (operator === '/' && answer % 1 !== 0));

  const equation = `${num1} ${operator} ${num2} =`;
  $('#equation').text(equation);
}

function checkAnswer() {
  const userAnswer = $('#user-input input').val();
  const correctAnswer = eval($('#equation').text().slice(0, -1));
  if (userAnswer == correctAnswer) {
    addTime();
    generateEquation();
    $('#user-input input').val('');
  }
}

$('#user-input').on('keyup', function (event) {
  if (event.keyCode === 13) {
    checkAnswer();
  }
});

$('#submit-btn').on('click', function () {
  checkAnswer();
});

