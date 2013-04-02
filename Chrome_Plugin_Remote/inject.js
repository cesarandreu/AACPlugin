


$.get('http://localhost:3000/checkLicense', function(response) {
  console.log('Response is: ' + response.hasLicense);
  if(!response.hasLicense){

    console.log('This user does not have a valid cookie.');

    //Appends the Bootstrap stylesheet.
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = chrome.extension.getURL('bootstrap.min.css');
    document.head.appendChild(style);

    //Appends the modal, hide the page, and activate the modal.
    $('body').append("<div id='quiz' class='modal fade'> <div class='modal-header'> <h3>Quiz</h3> </div> <div class='modal-body'> <form id='quizForm'><label class='control-label'>Do you pass the quiz?</label><label class='radio inline'><input type='radio' name='question' value='yes'> Yes</label><label class='radio inline'><input type='radio' name='question' value='no'> No</label></form> </div> <div class='modal-footer'> <button id='quizSubmit' class='btn btn-primary'>Submit</button> </div> </div>");
    $('body > :not(#quiz)').hide();
    $('#quiz').modal({backdrop: true, keyboard: false, show: true});


    //Sets a click event listener on the submit button for the modal.
    var button = document.getElementById('quizSubmit');
    button.addEventListener('click', function() {

      console.log('Value is:' + $("#quizForm input[type='radio']:checked").val());

      if($("#quizForm input[type='radio']:checked").val()==='yes'){

        $.post('http://localhost:3000/submitLicense', {submitLicense: true}, function(data){

            console.log('Yes');
            console.log('DATA: ' + data.saved);
            location.reload();

        });

      }
      else{
        console.log('No');
        location.reload();
      }

    }, false);

  } else {

    console.log('This user has a valid cookie.');

  }
});