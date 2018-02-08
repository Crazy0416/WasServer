function getMyPostRange(skip){
    axios.get('/users/card?number=' + (parseInt(skip)), {
        withCredentials: true
    })
    .then(function(response) {
        // JSON responses are automatically parsed.
        var data = response.data.data;
        console.log(data);
        response.data.data.forEach(function(v, i){
            var post = createPostObjToHtml(v);
            document.getElementById('userPostBox').appendChild(post);
            if(i === (response.data.data.length -1)){
                document.cookie = 'CardCnt='+ (parseInt(skip) + response.data.data.length) + ';path=/';
            }
        })
    })
}
