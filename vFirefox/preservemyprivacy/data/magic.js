//Name of the cookies, in this case it will be though of as a license
var cookieName = "license";
//Set the expiration date of the license
var time = 30;

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

//If the user does not have the cookies
if(!docCookies.hasItem(cookieName)){
    
  $('body').append("<div id='quiz' class='modal fade'> <div class='modal-header'> <h3>Quiz</h3> </div> <div class='modal-body'> <form id='quizForm'><label class='control-label'>Do you pass the quiz?</label><label class='radio inline'><input type='radio' name='question' value='yes'> Yes</label><label class='radio inline'><input type='radio' name='question' value='no'> No</label></form> </div> <div class='modal-footer'> <button id='quizSubmit' class='btn'>Submit</button> </div> </div>");
  $('body > :not(#quiz)').hide();
  $('#quiz').modal({backdrop: true, keyboard: false, show: true});
 
 
   var button = document.getElementById('quizSubmit');
   button.addEventListener('click', function() {

    if($("#quizForm input[type='radio']:checked").val()==='yes'){
        docCookies.setItem(cookieName, 'true', time);
        console.log('Yes');
        location.reload();
    }
    else{
        location.reload();
    }

  }, false);

};


//If the user does have the cookie.
if(docCookies.hasItem("License")){
    console.log("User has a valid license.")
}



