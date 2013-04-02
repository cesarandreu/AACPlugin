//Object for handling cookies
//From MDN: https://developer.mozilla.org/en-US/docs/DOM/document.cookie
var docCookies = {
  getItem: function (sKey) {
    if (!sKey || !this.hasItem(sKey)) { return null; }
    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toGMTString();
          break;
      }
    }
    document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
  },
  removeItem: function (sKey, sPath) {
    if (!sKey || !this.hasItem(sKey)) { return; }
    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: /* optional method: you can safely remove it! */ function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
    return aKeys;
  }
};

//Time (in seconds) that the cookie will last.
//Set to 31536e3 for a year
var time = 30;

//This is the cookie's name. All the cookie related functions will use this string.
var cookieName = 'license';

//Checks if the user has the cookie. If they don't they see a quiz and get a console message saying that they don't have a valid cookie.
if(!docCookies.getItem(cookieName)){
  
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

  //Prettier modal HTML code
  /*
    <div id='quiz' class='modal fade'>
        <div class='modal-header'>
            <h3>
                Quiz
            </h3>
        </div>
        <div class='modal-body'>
            <form id='quizForm'>
                <label class='control-label'>Do you pass the quiz?</label>
                <label class='radio inline'><input type='radio' name='question' value='yes'> Yes</label>
                <label class='radio inline'><input type='radio' name='question' value='no'> No</label>
            </form>
        </div>
        <div class='modal-footer'>
            <button id='quizSubmit' class='btn btn-primary'>Submit quiz</button>
        </div>
    </div>
  */

  //Sets a click event listener on the submit button for the modal.
  var button = document.getElementById('quizSubmit');
  button.addEventListener('click', function() {

    console.log('Value is:' + $("#quizForm input[type='radio']:checked").val());

    if($("#quizForm input[type='radio']:checked").val()==='yes'){
      docCookies.setItem(cookieName, 'true', time);
      console.log('Yes');
      location.reload();
    }
    else{
      console.log('No');
      location.reload();
    }

  }, false);

};

//If the user has a cookie, nothing gets added or removed from the page. And a message is printed to the console.
if(docCookies.getItem(cookieName)){
  console.log('This user has a valid cookie.');
}