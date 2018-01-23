function btnAjaxHandler(type, url, data, success){
    alert('hello');
    $.ajax({

        type : type,
        url : url,
        data : data,
        success : success

    });

}