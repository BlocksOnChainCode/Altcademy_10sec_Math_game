/* $(document).ready(function() {
  
  


  // When the submit button is clicked
  $('#submit-button').click(function() {
    var name = $('#name-input').val();
    var currentScore = score;

    // Send the highscore to the API
    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/highscores?api_key=119',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        name: name,
        score: currentScore
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
  });

  function fetchHighScores() {
    // Fetch the highscores from the API
    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/highscores?api_key=119',
      dataType: 'json',
      success: function (response, textStatus) {
        console.log(response);
        for (var i = 0; i < response.highscores.length; i++) {
          var highscore = response.highscores[i];
          var highscoreHtml = `
            <div class="highscore">
              <div class="name">${highscore.name}</div>
              <div class="score">${highscore.score}</div>
            </div>
          `;
          $('#highScore-list').append(highscoreHtml);
        }
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  fetchHighScores();
}); */



    







  /*
  $('#add-item-button').click(function() {
    var newItem = $('#new-item-input').val();

    //
    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=112',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        content: $('#new-item-input').val(),
      }),
      success: function (response, textStatus) {
        console.log(response);
        $('#all-tasks-container').empty();
        fetchTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
    console.log("reloaded?");
  });

  fetchTasks();
  
  $(document).on('click', '.delete-button', function() {
    var taskId = $(this).data('task-id');
    var deleteUrl = `https://fewd-todolist-api.onrender.com/tasks/${taskId}?api_key=112`;
    var $item = $(this).closest('.item');
    
    $.ajax({
      type: 'DELETE',
      url: deleteUrl,
      success: function (response, textStatus) {
        console.log(response);
        $item.remove();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  });
  
  $(document).on('change', ':checkbox', function() {
    var itemId = $(this).parent().data('id');
    var completed = $(this).prop('checked');
    
    $.ajax({
      type: 'PUT',
      url: `https://fewd-todolist-api.onrender.com/tasks/${itemId}/mark_complete?api_key=112`,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        completed: true
      }),
      success: function (response, textStatus) {
        fetchTasks();
        console.log(response);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  });
  
  function switchContainers(container) {
    $('#all-tasks-container').hide();
    $('#completed-tasks-container').hide();
    
    $('#' + container + '-tasks-container').show();
  }
  
  $(document).ready(function() {
    $('#navigation button').click(function() {
      var container = $(this).text().toLowerCase();
      switchContainers(container);
    });
  }); 
});

function fetchTasks() {
  $.ajax({
    type: 'GET',
    url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=112',
    dataType: 'json',
    success: function (response, textStatus) {
      console.log(response);
      $('#all-tasks-container').empty();
      $('#completed-tasks-container').empty(); 
      for (var i = 0; i < response.tasks.length; i++) {
        var task = response.tasks[i];
        var itemHtml = `
          <div class="item ${task.completed ? 'completed' : 'active'}" data-id="${task.id}">
            <div class="badge ${task.completed ? 'red' : 'green'}">${task.completed ? "Completed Tasks" : "All Tasks"}</div>
            <input type="checkbox" id="myCheckbox${i}" ${task.completed ? 'checked' : ''} ${task.completed ? 'disabled' : ''}>
            <label class="task" for="myCheckbox${i}">${task.content}</label>
            ${task.completed ? '<button class="delete-button" data-task-id="' + task.id + '">Delete</button>' : '<button class="start-button" data-task-id="' + task.id + '">Start</button>'}
          </div>
        `;
        if (task.completed) {
          $('#completed-tasks-container').append(itemHtml);
        } else {
          $('#all-tasks-container').append(itemHtml);
        }
      }
      switchContainers($('#navigation button.active').text().toLowerCase()); // call switchContainers with the currently active navigation button
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

$(document).on('click', '.start-button', function() {
  var taskId = $(this).data('task-id');
  var $item = $(this).closest('.item');
  $item.css('background-color', '#ffd4d4');
});

document.addEventListener("keydown", function(event) {
  if (event.code === "Enter") {
    $("#add-item-button").click();
  }
});*/