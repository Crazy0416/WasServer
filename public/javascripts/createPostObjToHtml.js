function createPostObjToHtml(objData){

    var post = document.createElement('a');
    post.setAttribute('class', "postItem");
    console.log(objData.ObjectId);
    post.setAttribute('href', '/users/card/'+ objData.ObjectId);      // TODO: uid 넣어야함
    var postItem_image = document.createElement('div');
    postItem_image.setAttribute('class', 'postItem_image');
    var img= document.createElement('img');
    img.setAttribute('src', objData.photo_path)
    postItem_image.appendChild(img);

    var postItem_text = document.createElement('div');
    postItem_text.setAttribute('class', 'postItem_text');

    var postItem_textTitle = document.createElement('div');
    postItem_textTitle.setAttribute('class', 'postItem_textTitle');
    var postTitle = document.createElement('h3');
    postTitle.setAttribute('class', 'postTitle');
    var textTitle = document.createTextNode(objData.title);
    postTitle.appendChild(textTitle);

    postItem_textTitle.appendChild(postTitle);
    postItem_text.appendChild(postItem_textTitle);

    var postItem_textContent = document.createElement('div');
    postItem_textContent.setAttribute('class', 'postItem_textContent');
    var postLine1 = document.createElement('div');
    var postLine2 = document.createElement('div');
    postLine1.setAttribute('class', 'postLine');
    postLine2.setAttribute('class', 'postLine');
    var textContent1 = document.createTextNode(objData.content.substr(0, 10));
    var textContent2 = document.createTextNode(objData.content.substr(10, 8) + '...');
    postLine1.appendChild(textContent1);
    postLine2.appendChild(textContent2);

    postItem_textContent.appendChild(postLine1);
    postItem_textContent.appendChild(postLine2);

    postItem_text.appendChild(postItem_textContent);

    post.appendChild(postItem_image);
    post.appendChild(postItem_text);

    return post;
}