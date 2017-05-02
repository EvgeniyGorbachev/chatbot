function getLastMessages() {
  return $(document).find('.sk-messages').children().last();

}

function getAllMessages() {
  return $(document).find('.sk-messages').children();
}

function getYoutubeId(url) {
  let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  let match = url.match(regExp);

  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return 'error';
  }
}


// Check for links and add iframe instead of all links.
function checkMessages(mes) {
  let messageJqueryObject = $(mes);

  let html = '';
  let iFrame = '';
  let messageText = messageJqueryObject.text();
  let textArray = messageText.split(' ');

  // Checking each word in the sentence
  $.each(textArray, function(index, text) {
    // If valid link
    if (/^(ftp|http|https):\/\/[^ "]+$/.test(text)) {

      let youtubeId = getYoutubeId(text);

      if (youtubeId != 'error') {
        iFrame += '<iframe width="200" height="200" src="//www.youtube.com/embed/' + youtubeId + '" frameborder="0" allowfullscreen></iframe>';
      } else {
        iFrame += '<iframe width="200" height="200" src="' + text + '" frameborder="0" allowfullscreen></iframe>';
      }

      // If link too long, replace it
      if (text.length > 60) {
        textArray[index] = '<strong><a href="' + text + '" target="_blank">link</a></strong>';
      }
    }
  });

  html = textArray.join(" ");
  html += iFrame;
  // Add new messages html
  messageJqueryObject.find('.sk-message-item').html(html);
}

jQuery(document).ready(function () {
  let token = $('#smooch_app_token').val();

  // Init Smooch messenger
  Smooch.init({appToken: token}).then(function () {

    // Listen new messages
    $(document).on('click','.send', function() {
      checkMessages(getLastMessages());
    });

    $(document).on('keyup','.message-input', function(e) {
      if(e.keyCode == 13) {
        checkMessages(getLastMessages());
      }
    });

    // Add delay for FireFox, hack
    setTimeout(function () {
      // Check all old messages
      $.each(getAllMessages(), function(index, mes) {
        checkMessages(mes);
      });
    }, 2000);

  });

});