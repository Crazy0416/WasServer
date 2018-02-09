function submitUrlHandler(formId, _method, url, callback) {
    var theForm = document.getElementById(formId);
    theForm.method = _method;
    theForm.action = url;
    $.ajax({
        url: url,                           // Any URL
        data: $('#'+formId).serialize(),                 // Serialize the form data
        success: function (data) {                        // If 200 OK
            callback(null, data);
        },
        error: function (xhr, text, error) {              // If 40x or 50x; errors
            callback(error, null);
        }
    });
}