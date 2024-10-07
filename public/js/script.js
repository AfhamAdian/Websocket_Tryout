document.addEventListener("DOMContentLoaded", (event) => {
    const joinRoomBtn = document.getElementById("joinRoomBtn");
    const sendMessageBtn = document.getElementById("sendMessageBtn");

    const socket = io();
    socket.on('connect', () => {
        socket.emit('message', `Hi I am ${socket.id}`, 'first');
    });

    socket.on('message', (message) => {
        console.log(message);
        addMessage(message);    
    });


    joinRoomBtn.addEventListener("click", () => {
        const roomId = document.getElementById("roomName").value;
        console.log(roomId);
        socket.emit('joinRoom', roomId);
        axios.post('/joinRoom', { roomId : roomId })
        .then( (response) => {
            console.log(response);
        })
        .catch( (error) => {
            console.log(error);
        });
    });

    sendMessageBtn.addEventListener("click", () => {
        const message = document.getElementById("message").value;
        const roomIdFromCookie = getCookie("roomId");
        console.log(roomIdFromCookie);
        if( !roomIdFromCookie ){
            socket.emit('message', message, 'notfirst', roomIdFromCookie);
        }
        else socket.emit('message', message, 'notfirst', roomIdFromCookie);
    });


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    async function addMessage(message){
        const messages = document.getElementById("messages");
        const messageElement = document.createElement("div");
        messageElement.innerText = message;
        messages.appendChild(messageElement);
    }

});
