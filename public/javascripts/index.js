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

  $("#emailForm").validate({
    submitHandler: function(form) {
      var data = {};
      data.email = $('#email').val();

      $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: '/newsletter',
        data: JSON.stringify(data),
        async: true,
        statusCode: {
          200: function(data) {
            console.log("Email passed back: " + data);
            if (data) {
              // Launch survey if new user
              //$('#survey').openModal();
              Materialize.toast('Successfully Added!', 4000)
              $('#email').val(''); 
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
    },

    invalidHandler: function(event, validator) {
      Materialize.toast('Invalid Email!', 4000)
    },
  });
  $("#emailForm").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
  });

  $("#surveyAgree").on('click', function(){
    $('#survey').closeModal();

    var data = {};

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

  $('#infoA').on('click', function(){
    $('html, body').animate({
        scrollTop: $('#paneTwo').offset().top - $('.navbar').height()
    }, 500);
    return false;
  });
  $('#infoB').on('click', function(){
    $('html, body').animate({
        scrollTop: $('#paneThree').offset().top - $('.navbar').height()
    }, 500);
    return false;
  });

  $('#becomeSeller').on('click', function(){
    $('#becomeChef').openModal();

  });

  $('#chefLast').on('focusin', function(){
    if (!$('#chefNameIcon').hasClass('active')) $('#chefNameIcon').addClass('active');
  });
  $('#chefLast').on('focusout', function(){
    if ($('#chefNameIcon').hasClass('active')) $('#chefNameIcon').removeClass('active');
  });

  $("#becomeChefForm").validate({
    submitHandler: function(form) {
      var isBreak = false;
      $.each($('#becomeChefForm').find('input'), function(index, elm){
        if ((!$(this).val() || $(elm).hasClass('error')) 
              && ($(elm).attr('type') != 'submit' && $(elm).attr('type') != 'hidden')) {
          Materialize.toast($(elm).data('error-message'), 4000);
          isBreak = true;
          return false;
        }
      });

      if (!isBreak){
        var chefModal = $('#becomeChef');

        var data = {};
        data.firstName = chefModal.find('#chefFirst').val(); 
        data.lastName = chefModal.find('#chefLast').val();
        data.email = chefModal.find('#chefEmail').val();
        data.telephone = chefModal.find('#chefPhone').val();
        data.pickup = chefModal.find('#chefAddress').val();

        $.ajax({
          type: 'POST',
          contentType: 'application/json',
          url: '/sellerinfo',
          data: JSON.stringify(data),
          async: true,
          statusCode: {
            200: function(data) {
              console.log("Email passed back: " + data);
              if (data) {
                // Launch survey if new user
                //$('#survey').openModal();
                Materialize.toast('Successfully Added!', 4000)
                $('#becomeChef').closeModal();
                chefModal.find('input').removeClass('valid');
                chefModal.find('i').removeClass('active');
                chefModal.find('#chefFirst').val(''); 
                chefModal.find('#chefLast').val('');
                chefModal.find('#chefEmail').val('');
                chefModal.find('#chefPhone').val('');
                chefModal.find('#chefAddress').val('');
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
      }
    },

    invalidHandler: function(event, validator) {
      // 'this' refers to the form
      var errors = validator.numberOfInvalids();
      Materialize.toast(validator.showErrors(), 4000)
      
      var errored = $(this).find('.error');
      Materialize.toast(errored.data('error-message'), 4000)
    },

  });
  $("#becomechefform").submit(function(event) {
    /* stop form from submitting normally */
    event.preventdefault();
  });

  /*
  $('#chefsubmit').on('click', function(event){
  */
})
