$(document).ready(function() {

  const timer = $('#timer');
  let timerValue = 10;
  let timerInterval;
  let score = 0;
  let mode = "Normal";
  let scoreSpamBlocker = false;

  // Hide containers
  $("#game-container").hide();
  $("#highScore-container").hide();
  $("#settings-container").hide();
  
  //when highScore button is clicked
  $('#highScore-button').click(() => {
    console.log('highScore button clicked --> Showing high scores')
    $("#home-container").hide(100);
    $("#highScore-container").show(100);
    $('#save-score').hide();
    $('#home-hidden').show();
    fetchHighScores();
  });
  
  //when home button is clicked
  $('.home-button').click(() => {
    console.log('home button clicked --> Showing home page')
    $("#highScore-container").hide(100);
    $("#game-container").hide(100);
    $("#settings-container").hide(100);
    $("#home-container").show(100);
    scoreSpamBlocker = false;
    score = 0;
  });
  
  // when settings button is clicked
  $('#settings-button').click(() => {
    console.log('settings button clicked --> Showing settings page')
    $("#home-container").hide(100);
    $("#settings-container").show(100);
  });
  
  // When play button is clicked
  $('.play-button').click(() => {
    console.log('play button clicked --> Showing game page')
    $("#home-container").hide();
    $('#settings-container').hide();
    $("#game-container").show(100);
    $('#timer').html(timerValue);
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
        timer.html(`${timerValue}`);
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

  $('#easy-button').click(function() {
    timerValue = 20;
    console.log(`Easy mode: ${timerValue}'s`);
    mode = "Easy";
    $('#difficulty').html(`Difficulty: ${mode}`);
  });
  $('#medium-button').click(function() {
    timerValue = 10;
    console.log(`Normal mode: ${timerValue}'s`)
    mode = "Normal";
    $('#difficulty').html(`Difficulty: ${mode}`);
  });
  $('#hard-button').click(function() {
    timerValue = 5;
    console.log(`Hard mode: ${timerValue}'s`)
    mode = "Hard";
    $('#difficulty').html(`Difficulty: ${mode}`);
  });

  // Add time
  function addTime() {
    console.log('time added')
    timerValue += 1;
    timer.html(`${timerValue}`);
    calculateScore();
  }
  
  function calculateScore() {
    score += timerValue * 5;
    //console.log(score);
    // Display score
    $('#score-container').text(`Score: ${score}`);
    return score;
  }
  
  // check mode
  function checkMode() {
    if (mode === "Easy") {
      timerValue = 20;
    } else if (mode === "Normal") {
      timerValue = 10;
    } else if (mode === "Hard") {
      timerValue = 5;
    }
  }

  // End game
  function endGame() {
    console.log('game ended --> Showing highscore prompt')
    clearInterval(timerInterval);
    $('#game-container').hide(100);
    $('#highScore-container').show(100);
    $('#save-score').show();
    $('#home-hidden').hide();
    $('#user-input input').val('');
    $('#user-input input').blur();
    $('#user-input input').focus();
    $('#name-input input').focus();
    checkMode();
    timer.html(`${timerValue}`);
  }
  // When the submit button is clicked
  $('#save-button').click(function(event) {
    event.preventDefault();
    var name = $('#name-input').val();
    var currentScore = score;
    
    if (!scoreSpamBlocker) {
      $.ajax({
        type: 'POST',
        url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=119',
        data: JSON.stringify({
          task: {
            content: `{"name": "${name}", "currentScore": "${currentScore}", "mode": "${mode}"}`
            }
          }), 
        contentType: 'application/json',
        success: function(response) {
          console.log(response);
          fetchHighScores();
        },
        error: function(xhr, textStatus, errorThrown) {
          console.log('Error:', errorThrown);
        }
      });
    }
    scoreSpamBlocker = true;
    $('#save-score').hide();
    $('#home-hidden').show();
    console.log(`HIGHSCORE SAVED - Score: ${score}`);
  });
  
  function fetchHighScores() {
    // Clear the high score list
    $('#highScore-list').html('');

    // Fetch the high scores from the API
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=119',
      dataType: 'json',
    
      success: function (response, _textStatus) {
        console.log(response);
        
        // Sort High Scores
        var sortedTasks = response.tasks.sort(function(a, b) {
          var taskA = JSON.parse(a.content);
          var taskB = JSON.parse(b.content);
          return taskB.currentScore - taskA.currentScore;
        }
        );

        // Create and append HighSCore items
        // only the top 10 show
        for (var i = 0; i < 10 && i < sortedTasks.length; i++) {
          var task = sortedTasks[i];
              //console.log(`HIGHSCORE BEFORE PARSE`);
              //console.log(task);
          var taskContent = JSON.parse(task.content);
              //console.log(`HIGHSCORE.CONTENT AFTER PARSE`);
              //console.log(taskContent);
          var taskName = taskContent.name;
          var taskScore = taskContent.currentScore;
          var taskMode = taskContent.mode;
          var taskID = task.id;
          var taskHTML = `
            <tr class="highScore-item">
              <td class="highScore-name">${taskName}</td>
              <td class="highScore-score">${taskScore}</td>
              <td class="highScore-mode">${taskMode}</td>
            </tr>
          `;
          $('#highScore-list').append(taskHTML);
        }
      },
    
      error: function (_xhr, _textStatus, errorThrown) {
        console.log('Error:', errorThrown);
      }
    });
    console.log(`HIGHSCORES FETCHED`);
  }

}); 


//!!!! WIPE THE ENTIRE HIGHSCORE MEMORY !!!!!!!!
/*
resetHighScores();    
*/
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function resetHighScores() {
  $.ajax({
    type: 'GET',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=119',
    dataType: 'json',

    success: function (response, _textStatus) {
      console.log(response);
      
      // Delete each task individually
      for (var i = 0; i < response.tasks.length; i++) {
        var taskId = response.tasks[i].id;
        $.ajax({
          type: 'DELETE',
          url: `https://fewd-todolist-api.onrender.com/tasks/${taskId}?api_key=119`,
          success: function (response, _textStatus) {
            console.log(response);
          },
          error: function (_xhr, _textStatus, errorThrown) {
            console.log('Error:', errorThrown);
          }
        });
      }
    },

    error: function (_xhr, _textStatus, errorThrown) {
      console.log('Error:', errorThrown);
    }
  });
}