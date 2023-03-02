$(document).ready(function() {

  let score = 0;
  let timerValue = 10;
  let timerInterval;
  let mode = "normal";
  let name;
  const timer = $('#timer');
  let scoreSpamBlocker = false;


  // Hide game container and highScore container
  $("#game-container").hide();
  $("#highScore-container").hide();
  $("#settings-container").hide();
  
  //check mode

  //when highScore button is clicked
  $('#highScore-button').click(() => {
    $("#home-container").hide(100);
    $("#highScore-container").show(100);
    $('#save-score').hide();
    $('#home-hidden').show();
    fetchHighScores();
  });
  
  //when home button is clicked
  $('.home-button').click(() => {
    $("#highScore-container").hide(100);
    $("#game-container").hide(100);
    $("#settings-container").hide(100);
    $("#home-container").show(100);
    scoreSpamBlocker = false;
    score = 0;
  });
  
  // when settings button is clicked
  $('#settings-button').click(() => {
    $("#home-container").hide(100);
    $("#settings-container").show(100);
  });
  
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

  $('#easy-button').click(function() {
    timerValue = 20;
    console.log(timerValue);
    mode = "easy";
  });
  $('#medium-button').click(function() {
    timerValue = 10;
    console.log(timerValue);
    mode = "normal";
  });
  $('#hard-button').click(function() {
    timerValue = 5;
    console.log(timerValue);
    mode = "hard";
  });


  // Add time
  function addTime() {
    timerValue += 1;
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
  
  

  // check mode
  function checkMode() {
    if (mode === "easy") {
      timerValue = 20;
    } else if (mode === "normal") {
      timerValue = 10;
    } else if (mode === "hard") {
      timerValue = 5;
    }
  }

  // End game
  function endGame() {
    clearInterval(timerInterval);
    $('#game-container').hide(100);
    $('#highScore-container').show(100);
    $('#save-score').show();
    $('#home-hidden').hide();
    $('#user-input input').val('');
    $('#user-input input').blur();
    $('#name-input input').attr('placeholder', 'Enter your name');
    $('#user-input input').focus();
    $('#name-input input').focus();
    checkMode();
    timer.html(`Time left: ${timerValue}s`);
    
  
    fetchHighScores();
  }
  

  function fetchHighScores() {
    // Clear the high score list
    $('#highScore-list table').html(`
      <tr>
        <th>Name</th>
        <th>Score</th>
        <th>Mode</th>
      </tr>
    `)    


    // Fetch the high scores from the API
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=119',
      dataType: 'json',
    
      success: function (response, _textStatus) {
        console.log(response);
        
        // Extract scores from response and sort them in descending order
        var scores = response.tasks.map(function(task) {
          var [name, score, mode] = task.content.split(':');
          return {
            name: name,
            score: parseInt(score),
            mode: mode
          };
        }).sort(function(a, b) {
          return b.score - a.score;
        });
        
        // Generate HTML for the top 20 high scores
        for (var i = 0; i < 15 && i < scores.length; i++) {
          var score = scores[i];
          var highScoreHtml = `
            <tr>
              <td>${score.name}</td>
              <td>${score.score}</td>
              <td class="mode">${score.mode}</td>
            </tr>
          `;
          $('#highScore-list table').append(highScoreHtml);
        }
      },
    
      error: function (_xhr, _textStatus, errorThrown) {
        console.log('Error:', errorThrown);
      }
    });
    
    
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
            content: `${name + ":" + currentScore + ":" + mode}`
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

    // Send the highscore to the API
  });
  
  //fetchHighScores();
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