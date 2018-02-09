function getChatServerUrl(){
    $.ajax({
        type : 'GET',
        url : '/chatserver/count',
        crossDomain : true,
        success : function(data) {
            console.log('getChatServerUrl response: ' + JSON.stringify(data));
            connectChatServer('ws://' + data.data.ip + '/' + data.data.tagName + '/websocket');
        },
        error:function(request,status,error){
            console.log(request);
            console.log(status);
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}

function createChatMessage(img_url, uid, msg_data){
    var chatMessage_Container = document.createElement('div');
    chatMessage_Container.setAttribute('class', 'chatMessage_Container');

    var chatMessage_divImage = document.createElement('div');
    chatMessage_divImage.setAttribute('class', 'chatMessage_divImage');

    var chatMessage_Image = document.createElement('img');
    chatMessage_Image.setAttribute('class', 'chatMessage_Image');
    chatMessage_Image.setAttribute('src', img_url);

    chatMessage_divImage.appendChild(chatMessage_Image);

    var chatMessage_uid = document.createElement('div');
    chatMessage_uid.setAttribute('class', 'chatMessage_uid');

    var uidtextnode = document.createTextNode(uid);
    chatMessage_uid.appendChild(uidtextnode);

    var chatMessage_message = document.createElement('div');
    chatMessage_message.setAttribute('class', 'chatMessage_message');

    var msgtextnode = document.createTextNode(msg_data);
    chatMessage_message.appendChild(msgtextnode);

    chatMessage_Container.appendChild(chatMessage_divImage);
    chatMessage_Container.appendChild(chatMessage_uid);
    chatMessage_Container.appendChild(chatMessage_message);

    document.getElementById('chatView').appendChild(chatMessage_Container);
}

function connectChatServer(url) {
    if (!window.WebSocket) {
        window.WebSocket = window.MozWebSocket;
    }
    if (window.WebSocket) {
        console.log("websocket : " + url);
        socket = new WebSocket(url);        //"ws://127.0.0.1:8080/123/websocket"
        socket.onmessage = function(event) {
            var uid = event.data.split(':')[0];
            var messgage = event.data.substr(event.data.indexOf(":"));
            createChatMessage("/images/username.png", uid, messgage);

            var objDiv = document.getElementById("chatView");
            objDiv.scrollTop = objDiv.scrollHeight;

            console.log(event.data);
        };
        socket.onopen = function(event) {
            createChatMessage("", "운영자", "채팅방에 입장하셨습니다.");
            console.log(event.data);
        };
        socket.onclose = function(event) {
            createChatMessage("", "운영자", "서버와의 접속이 끊겼습니다.");
            console.log(event.data);
        };
    } else {
        alert("Your browser does not support Web Socket.");
    }
}

function send(message) {
    $(function(){$('#chatTextBox').val('');});  if (!window.WebSocket) { return; }
    if (socket.readyState == WebSocket.OPEN) {
        socket.send(message);
    } else {
        alert("서버와 연결되어있지 않습니다.");
    }
}