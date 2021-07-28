const socket = io('http://localhost:5000');
const messageContainer = document.getElementById('message-container');
const messageFrom = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const list = document.getElementById('ul');
const title = document.getElementById('title');
var chat = {};
let name;
do {

    name = prompt('What is your name?');
} while (!name)
// appendMessage('You joined.');
socket.emit('new-user', name)

socket.on('chat-message', data => {
    console.log(data);
    messageRecieved(`${data.name} : ${data.message}`);
})
socket.on('user-connected', data => {
    console.log(data);
    // userConnect(`${data.name} connected.`);
    userList(data);

})
socket.on('user-list', users => {
    list.innerText = "";
    for (let x in users) {
        let data = { name: users[x], socketId: x }
        console.log(socket.id);
        console.log(data);
        if (x != socket.id) {
            userList(data);
        }
    }
})

messageFrom.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You : ${message}`);
    socket.emit('send-chat-message', { from: socket.id, to: chat.socketId, message: message });
    messageInput.value = '';
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.style.textAlign = "right";
    messageContainer.append(messageElement);

}

function messageRecieved(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);

}

function userConnect(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.style.textAlign = "center";
    messageContainer.append(messageElement);

}

function userList(data) {
    const userElement = document.createElement('li')
    userElement.innerText = data.name;
    userElement.setAttribute('data', data.socketId);
    userElement.setAttribute('onclick', "startChat(this)")
    list.append(userElement);
}

function startChat(e) {


    if (title.innerText != e.innerText) {
        messageContainer.innerText = "";
        let chatTitle = document.getElementById('chatTitle');
        if (chatTitle)
            chatTitle.remove();
        const titleElement = document.createElement('div');
        titleElement.setAttribute('id', 'chatTitle');
        titleElement.innerText = e.innerText;
        title.append(titleElement);
        console.log(e);
        chat = { name: e.innerText, socketId: e.getAttribute('data') }
        // console.log(e.getAttribute('data'));
        console.log('chat', chat);
    }

}