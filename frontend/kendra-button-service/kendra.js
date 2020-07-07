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
    var id, target, _src, floating;

    for (var i = 0; i < params.length; i++) {
      if (!params[i]) continue;
      if (params[i].indexOf('id=') > -1) {
        id = params[i].replace('id=', '');
      } else if (params[i].indexOf('target=') > -1) {
        target = params[i].replace('target=', '');
      } else if (params[i].indexOf('src=') > -1) {
        _src = params[i].replace('src=', '');
      } else if (params[i].indexOf('floating=') > -1) {
        floating = true;
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
    var src = _src || 'https://service.kendra.fun/' + params;

    var iframenode = document.createElement('iframe');
    iframenode.setAttribute('id', kendraIframeId);
    iframenode.setAttribute('src', src);
    iframenode.setAttribute(
      'style',
      'position:relative!important;height:100%!important;width:100%!important;border:none!important;',
    );

    var targetNode = document.getElementById(kendraWrapperId);
    targetNode.appendChild(iframenode);

    if (floating) {
      var iframenode = document.createElement('iframe');
      iframenode.setAttribute('id', kendraIframeId);
      iframenode.setAttribute('src', src);
      iframenode.setAttribute(
        'style',
        'position:relative!important;height:100%!important;width:100%!important;border:none!important;',
      );

      var floatingNode = document.createElement('div');
      floatingNode.appendChild(iframenode);
      floatingNode.setAttribute(
        'style',
        'position: fixed; bottom: 1rem; right: 1rem; max-width: 90%; height: 20%;border-radius: .5rem;box-shadow: 2px 2px 3px 1px rgba(0, 0, 0, 0.3);overflow: auto;',
      );
      console.log('floatingNode', { floatingNode });
      document.body.appendChild(floatingNode);
    }
  } else {
    console.log('no id received');
  }
})();
