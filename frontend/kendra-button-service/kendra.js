(function () {
  var kendraWrapperId = 'kendra-button-wraper';
  var kendraIframeId = 'kendra-button-iframe';
  var node = document.createElement('div');
  node.id = kendraWrapperId;

  var myName = 'kendra.js';
  var myPath = document.querySelector('script[src*="' + myName + '"]').src;

  console.log('src path is:', myPath);

  var splittedPath = myPath.split(myName + '?');
  if (splittedPath.length > 1) {
    console.log('id received', splittedPath[1]);

    var params = splittedPath[1].split('&');
    var id, target, _src;
    for (var i = 0; i < params.length; i++) {
      if (!params[i]) continue;
      if (params[i].indexOf('id=') > -1) {
        id = params[i].replace('id=', '');
      } else if (params[i].indexOf('target=') > -1) {
        target = params[i].replace('target=', '');
      } else if (params[i].indexOf('src=') > -1) {
        _src = params[i].replace('src=', '');
      }
    }
    console.log({ id, target });
    console.log({ node });

    if (!target) {
      document.body.appendChild(node);
    } else {
      document.querySelector(target).replaceWith(node);

      // set Localstorage
      window.localStorage.setItem('kendra-serviceId', id);
    }

    var params = '?id=' + id + '&domain=' + location.origin;
    _src =
      'https://feature-frontend-service.dcj1fh5deo5r3.amplifyapp.com/' + params; // temp
    var src = _src || 'https://button.kendra.fun' + params;
    var root = document.getElementById(kendraWrapperId);
    root.innerHTML +=
      '<iframe id="' +
      kendraIframeId +
      '" src="' +
      src +
      '" style="position:relative!important;height:100%!important;width:100%!important;border:none!important;"></iframe>';
  } else {
    console.log('no id received');
  }

  // window.addEventListener('DOMContentLoaded', function() {
  // });
})();
