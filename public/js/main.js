const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL using QS - Query String library
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true // To ignore % & other symbols during grabbing URL
});

const socket = io();

// Join chat - catch this on server side
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    // output function related to DOM
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    console.log(message); // The same message we are sending on server side intercepted on client side console 
    outputMessage(message);

    // For every type of new message scroll down immediately automatically
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message Submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // It submits automatically to file so we prevent it happening by preventDefault on event e.

    // Get message text
    const msg = e.target.elements.msg.value; // Basically getting by ID

    // Emit message to server
    socket.emit('chatMessage', msg); // Sending message as the payload

    // Clear input after sending message in textbox
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message){ // This message is now an object and no longer string so we return message.text
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')} 
    `;
    // Mapping throught the arrays for each user we wanna output a string with <li>... and we have to apply join() because its array
}