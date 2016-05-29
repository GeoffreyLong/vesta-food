$(document).ready(function(){
  ////////////////////////////////////////////////////////////////////////////
                    /********** Header Scrolling **********/
  ////////////////////////////////////////////////////////////////////////////
  $(document).on('scroll', function (e) { 
    updateHeader(); 
  });
  function updateHeader() {
    var o = $(document).scrollTop() / ($('#splashPane').height() - $('nav').height());
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

  ////////////////////////////////////////////////////////////////////////////
                      /********** Header Links **********/
  ////////////////////////////////////////////////////////////////////////////
  $('#infoA').on('click', function(){
    $('html, body').animate({
        scrollTop: $('#infoPane').offset().top - $('.navbar').height() + 1
    }, 500);
    return false;
  });
  $('#infoB').on('click', function(){
    $('html, body').animate({
        scrollTop: $('#addChefPane').offset().top - $('.navbar').height() + 1
    }, 500);
    return false;
  });


  ////////////////////////////////////////////////////////////////////////////
                        /********** Email Form **********/
  ////////////////////////////////////////////////////////////////////////////
  $("#locationSearch").submit(function(event) {
    /* stop form from submitting normally */
    event.preventDefault();
    var data = {};
    data.searchAddress = $('#searchAddress').val();

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: '/locationSearch',
      data: JSON.stringify(data),
      async: true,
      statusCode: {
        200: function(data) {
          console.log("Locations passed back: " + data);
          Materialize.toast('TODO add functionality!', 4000)
          window.location.href = "/";
        },
        400: function() {
          alert("Didn't work");
        }
      }
    });
  });


  /*
  $('.card-image').slick({
    // This will load the images lazily
    // lazyLoad: 'ondemand', 
    dots: true,
    arrows: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true
  });
  */


  ////////////////////////////////////////////////////////////////////////////
                    /********** OTHER **********/
  ////////////////////////////////////////////////////////////////////////////
  // This scrolls and focuses on the email form on link click
  $('.emailFormLink').on('click', function(){
    $('html, body').animate({
        scrollTop: 0
    }, 500);
    $('#formContainer input[type="text"]').focus();
  });

  // Open the newsletter/menu modal
  $('#menuDivContainer').on('click', function(){ 
    $('#menuModal').openModal();
  });


  $('#facebookLogin').on('click', function(){
    window.location.href = "/auth/facebook";
  });
});
