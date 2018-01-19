function submitUrlHandler(formId, _method, url) {
    var theForm = document[formId];
    theForm.method = _method;
    theForm.action = url;
    theForm.submit();
}