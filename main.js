/**
 * ! :
 * ? :
 * TODO : 
 * 
 */



$(document).ready(function() {

  $('#medium').prop('checked', true);

  let score = 0;
  let timerValue = 10;
  let timerInterval;
  const timer = $('#timer');
  let name;
  // Hide game container and highScore container
  $("#game-container").hide();
  $("#highScore-container").hide();
  $("#settings-container").hide();
  
  //check mode

  //when highScore button is clicked
  $('#highScore-button').click(() => {
    $("#home-container").hide(100);
    $("#highScore-container").show(100);
    fetchHighScores();
  });
  
  //when home button is clicked
  $('.home-button').click(() => {
    $("#highScore-container").hide(100);
    $("#game-container").hide(100);
    $("#settings-container").hide(100);
    $("#home-container").show(100);
   
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

/*   $('#easy-button').click(function() {
    console.log('easy button clicked');
    $('#easy-button').prop('checked', true);
    $('#medium-button').prop('checked', false);
    $('#hard-button').prop('checked', false);
    checkMode();
    console.log(timerValue);
  })
  $('#medium-button').click(function() {
    console.log('medium button clicked');
    $('#easy').prop('checked', false);
    $('#medium').prop('checked', true);
    $('#hard').prop('checked', false);
    checkMode();
    console.log(timerValue);
  })
  $('#hard-button').click(function() {
    console.log('hard button clicked');
    $('#easy').prop('checked', false);
    $('#medium').prop('checked', false);
    $('#hard').prop('checked', true);
    checkMode();
    console.log(timerValue);
  })
 */

/*   // check mode
  function checkMode() {
    console.log('check mode');
    if ($('#easy').is(':checked')) {
      timerValue = 10;
    } else if ($('#medium').is(':checked')) {
      timerValue = 5;
    } else if ($('#hard').is(':checked')) {
      timerValue = 3;
    }
  }

  // check operator
  function checkOperator() {
    if ($('#add').is(':checked')) {
      operator = '+';
    } else if ($('#subtract').is(':checked')) {
      operator = '-';
    } else if ($('#multiply').is(':checked')) {
      operator = '*';
    } else if ($('#divide').is(':checked')) {
      operator = '/';
    }
  }
 */


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
  
  // End game
  function endGame() {
    clearInterval(timerInterval);
    $('#game-container').hide(100);
    $('#highScore-container').show(100);
    fetchHighScores();
  }
  
  $('#save-btn').on('click', function () {
    checkAnswer();
  });
  
  function fetchHighScores() {
    // Clear the high score list
    $('#highScore-list table').html(`
      <tr>
        <th>Name</th>
        <th>Score</th>
        <th>Mode</th>
        <th>Operator</th>
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
          var [name, score] = task.content.split(':');
          return {
            name: name,
            score: parseInt(score)
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
              <td class="mode">Easy</td>
              <td class="operator">+</td>
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
    
    // Send the highscore to the API
        $.ajax({
          type: 'POST',
          url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=119',
          data: JSON.stringify({
            task: {
              content: `${name + ":" + currentScore}`
            }
          }),
          contentType: 'application/json',
          success: function(response) {
            console.log(response);
          },
          error: function(xhr, textStatus, errorThrown) {
            console.log('Error:', errorThrown);
          }
        });
    fetchHighScores();
  });
  

  //fetchHighScores();
}); 





// CLEAR THE ENTIRE SCOREBOARD
/*
resetHighScores();
*/
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