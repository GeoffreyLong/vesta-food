$(document).ready(function(){

  $(document).on('scroll', function (e) { 
    updateHeader(); 
  });

  function updateHeader() {
    var o = $(document).scrollTop() / 500;
    if (o > 1.000) { o = 1; }
    var e = $('nav');
    var newColor = 'rgba(' + 41 + ',' + 182 + ',' + 246 + ',' + o + ')';
    e.attr('style', 'background-color: ' + newColor + ' !important');

    if (o < 0.6){
      e.removeClass('z-depth-1');
      e.addClass('z-depth-0');
    }
    if (o >= 0.6){
      e.removeClass('z-depth-0');
      e.addClass('z-depth-1');
    }
  }

  updateHeader();

  $("#emailForm").submit(function(event) {

    /* stop form from submitting normally */
    event.preventDefault();

    var targetUrl = $(this).attr('action');
    var data = {};
    data.email = $('#email').val();

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: targetUrl,
      data: JSON.stringify(data),
      async: true,
      statusCode: {
        200: function(data) {
          console.log("Email passed back: " + data);
          if (data) {
            // Launch survey if new user
            $('#survey').openModal();
          }
          else{
            Materialize.toast('Email already exists!', 4000)
          }

        },
        400: function() {
          alert("Didn't work");
        }
      }
    });

  });

  $("#surveyAgree").on('click', function(){
    $('#survey').closeModal();

    var data = {};
    console.log("hello");

    /*
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: '/survey',
      data: JSON.stringify(data),
      async: true,
      statusCode: {
        200: function(data) {
          console.log("Email passed back: " + data);
          if (data) {
            // Launch survey if new user
            $('#survey').openModal();
          }
          else{
            Materialize.toast('Email already exists!', 4000)
          }

        },
        400: function() {
          alert("Didn't work");
        }
      }
    });
    */
  });

})
