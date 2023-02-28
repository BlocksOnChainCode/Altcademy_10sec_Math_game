/**
 * ! :
 * ? :
 * TODO : 
 * 
 */
let score = 0;
let timerValue = 10;
let timerInterval;
const timer = $('#timer');

// Hide game container and highScore container
$("#game-container").hide();
$("#highScore-container").hide();


// When play button is clicked
$('#play-button').click(() => {
  $("#home-container").hide(100);
  $("#game-container").show(100);
  startTimer();
  generateEquation();
});


// Start timer
function startTimer() {
  console.log('timer started')
  timerInterval = setInterval(() => {
    if (timerValue <= 0) {
      clearInterval(timerInterval);
      endGame();
    } else {
      //console.log(timerValue)
      timerValue--;
      timer.html(`Time left: ${timerValue}s`);
    }
  }, 1000);
  $('#user-input input').focus();
}

// Generate equation
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

// Check answer on enter
$('#user-input').on('keyup', function (event) {
  if (event.keyCode === 13) {
    checkAnswer();
  }
});
function checkAnswer() {
  const userAnswer = $('#user-input input').val();
  const correctAnswer = eval($('#equation').text().slice(0, -1));
  if (userAnswer == correctAnswer) {
    addTime();
    generateEquation();
    $('#user-input input').val('');
  }
}

// Add time
function addTime() {
  timerValue += 5;
  timer.html(`Time left: ${timerValue}s`);
  calculateScore();
}

function calculateScore() {
  score += timerValue * 5;
  console.log(score);

  // Display score
  $('#score-container').text(`Score: ${score}`);
  return score;
}

// End game
function endGame() {
  clearInterval(timerInterval);
  $('#game-container').hide(100);
  $('#highScore-container').show(100);
}

$('#save-btn').on('click', function () {
  checkAnswer();
});

$(document).ready(function() {
  
  


  // When the submit button is clicked
  $('#submit-button').click(function() {
    var name = $('#name-input').val();
    var currentScore = score;

    // Send the highscore to the API
    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=119',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        content: name,
        
      }),
      success: function (response, textStatus) {
        console.log(response);
        $('#highScore-list').empty();
        fetchHighScores();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      } 
    });

    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=120',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        content: currentScore,

      }),
      success: function (response, textStatus) {
        console.log(response);
        $('#highScore-list').empty();
        fetchHighScores();
      }


    });
  });

  function fetchHighScores() {
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=119',
      dataType: 'json',
      success: function (response, textStatus) {
        console.log(response);
        for (var i = 0; i < response.tasks.length; i++) {
          var highScore = response.tasks[i];
          var highScoreHtml = `
            <div id="id-${highScore.id}" class="highScore">
              <div id="name-${highScore[i]}" class="name">${highScore.content}</div>
            </div>
          `;
          $('#highScore-list').append(highScoreHtml);
        }
      }
    });
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=120',
      dataType: 'json',
      success: function (response, textStatus) {
        console.log(response);
        for (var i = 0; i < response.tasks.length; i++) {
          var highScore = response.tasks[i];
          var highScoreHtml = `
              <div id="score${highScore.id}" class="score">${highScore.content}</div>
          `;
          //append to the div element with the id of 'id-[i]'
          $('#id-' + i).append(highScoreHtml);
        }
      }
    });
    
  }





/*   function fetchHighScores() {
    // Fetch the highScores from the API
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=119',
      dataType: 'json',
      success: function (response, textStatus) {
        console.log(response);
        for (var i = 0; i < response.tasks.length; i++) {
          var highScore = response.tasks[i];
          var highScoreHtml = `
            <div class="highScore">
              <div id="score${tasks[i]}" class="name">${tasks.content}</div>
            </div>
          `;
          $('#highScore-list').append(highScoreHtml);
        }
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=120',
      dataType: 'json',
      success: function (response, textStatus) {
        console.log(response);
        for (var i = 0; i < response.tasks.length; i++) {
          var highScore = response.tasks[i];
          var highScoreHtml = `
              <div class="name">${tasks.content}</div>
          `;
          $('#').append(highScoreHtml);
        }
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  fetchHighScores(); */
});