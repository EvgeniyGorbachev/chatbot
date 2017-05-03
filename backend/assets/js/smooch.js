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
        iFrame += '<iframe width="100%" height="auto" src="//www.youtube.com/embed/' + youtubeId + '" frameborder="0" allowfullscreen></iframe>';
      } else {
        iFrame += '<iframe width="100%" height="auto" src="' + text + '" frameborder="0" allowfullscreen></iframe>';
      }

      // Add link to tag <a>
      // textArray[index] = '<strong><a href="' + text + '" target="_blank">link</a></strong>';

      // Set 100% width for iFrame
      messageJqueryObject.find('.sk-msg').attr('id', 'chat-iframe');
      messageJqueryObject.find('.sk-message-item').attr('id', 'chat-iframe');
    }
  });

  html = textArray.join(" ");
  html += iFrame;

  // Add new messages html
  messageJqueryObject.find('.sk-message-item').html(html);
}

jQuery(document).ready(function () {
  let token = $('#smooch_app_token').val();
  let mesCount = 0;

  // Init Smooch messenger
  Smooch.init({appToken: token}).then(function () {

    // Listen new messages (add by manager)
    // $(document).on('click','.send', function() {
    //   checkMessages(getLastMessages());
    // });
    //
    // $(document).on('keyup','.message-input', function(e) {
    //   if(e.keyCode == 13) {
    //     checkMessages(getLastMessages());
    //   }
    // });

    // Init
    // Add delay for FireFox, hack
    setTimeout(function () {
      mesCount = getAllMessages().length;
      // Check all old messages
      $.each(getAllMessages(), function(index, mes) {
        checkMessages(mes);
      });
    }, 2000);

    // Watch if add new messages
    $(document).bind('DOMSubtreeModified', function(e) {
      if (e.target.innerHTML.length > 0) {

        let count = getAllMessages().length;

        if (count != mesCount) {
          console.log('add new message');
          mesCount = count;

          $.each(getAllMessages(), function(index, mes) {
            checkMessages(mes);
          });
        }

      }
    });

  });

});
