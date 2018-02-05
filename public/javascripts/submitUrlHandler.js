function submitUrlHandler(formId, _method, url, callback) {
    var theForm = document.getElementById(formId);
    theForm.method = _method;
    theForm.action = url;
    theForm.bind('ajax:complete', callback);
    theForm.submit();
}