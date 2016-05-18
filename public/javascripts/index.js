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
      var errored = $("#becomeChefForm").find('input.error');
      if (errored) {
        console.log('errored');
        $.each(errored, function(index, elm){
          Materialize.toast(errored.data('error-message'), 4000);
        });
      }
      else {
        console.log('not errored');
        var isBreak = false;
        $.each($('#becomeChefForm').find('input'), function(index, elm){
          if (!elm.val()){
            Materialize.toast(errored.data('error-message'), 4000);
            isBreak = true;
            return false;
          }
        });
        console.log(isBreak);

        if (!isBreak){
          Materialize.toast('good stuff', 4000);
        }
      }
    },

    invalidHandler: function(event, validator) {
      // 'this' refers to the form
      var errors = validator.numberOfInvalids();
      Materialize.toast(validator.showErrors(), 4000)
      
      var errored = $(this).find('.error');
      Materialize.toast(errored.data('error-message'), 4000)

      
      if (errors) {
        var message = errors == 1
          ? 'you missed 1 field. it has been highlighted'
          : 'you missed ' + errors + ' fields. they have been highlighted';
        $("div.error span").html(message);
        $("div.error").show();
      } else {
        $("div.error").hide();
      }
    },

  });
  $("#becomechefform").submit(function(event) {
    /* stop form from submitting normally */
    event.preventdefault();
  });

  /*
  $('#chefsubmit').on('click', function(event){
    var chefmodal = $('#becomechef');

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
  });
  */
})
