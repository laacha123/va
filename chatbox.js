// Create the CSS styles and append to the document head
const styles = `
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}
.chat-icon {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #ADD8E6;
    color: white;
    border-radius: 50%;
    padding: 15px;
    cursor: pointer;
    font-size: 24px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
}
.chat-icon:hover {
    background-color: #87CEEB;
}
.chat-box {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 400px;
    height: 500px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    display: none;
    flex-direction: column;
    overflow: hidden;
}
.chat-header {
    background-color: #ADD8E6;
    color: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.chat-header h3 {
    margin: 0;
}
.close-chat {
    cursor: pointer;
    font-size: 16px;
}
.chat-content {
    padding: 10px;
    height: 380px;
    overflow-y: auto;
    border-bottom: 1px solid #ddd;
    flex-grow: 1;
}
.message {
    margin-bottom: 10px;
}
.chat-input {
    display: flex;
    padding: 10px;
    background-color: #f4f4f4;
    border-top: 1px solid #ddd;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
}
.chat-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-right: 10px;
    height: 40px;
}
.chat-input button {
    padding: 10px;
    background-color: #ADD8E6;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    height: 40px;
}
.chat-input button:hover {
    background-color: #87CEEB;
}
`;

// Append styles to the head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Create chat box HTML
const chatBoxHTML = `
<div class="chat-icon" id="chatIcon">
    💬
</div>
<div class="chat-box" id="chatBox">
    <div class="chat-header">
        <h3>Chat with us</h3>
        <span class="close-chat" id="closeChat">x</span>
    </div>
    <div class="chat-content" id="chatContent">
        <!-- Chat messages will appear here -->
    </div>
    <div class="chat-input">
        <input type="text" id="userInput" placeholder="Type your message...">
        <button id="sendBtn">Send</button>
    </div>
</div>
`;

// Ensure DOM is fully loaded before manipulating it
document.addEventListener('DOMContentLoaded', function() {
    // Append chat box to the body
    const chatBoxContainer = document.createElement("div");
    chatBoxContainer.innerHTML = chatBoxHTML;
    document.body.appendChild(chatBoxContainer);

    // Add event listeners for chat functionality
    document.getElementById('chatIcon').addEventListener('click', function() {
        document.getElementById('chatBox').style.display = 'block';
    });

    document.getElementById('closeChat').addEventListener('click', function() {
        document.getElementById('chatBox').style.display = 'none';
    });

    // Initialize Socket.IO connection
    const socket = io('https://va.wordsystech.com', {
        withCredentials: true
    });  
    // Replace with your actual Flask app URL
    let chatHistory = '';

    document.getElementById('sendBtn').addEventListener('click', function() {
        sendMessage();
    });

    document.getElementById('userInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    socket.on('bot_message', function(data) {
        const message = data.message;
        displayMessage('Bot', message);
        chatHistory += `Bot: ${message}\n`;
    });

    function sendMessage() {
        const userInput = document.getElementById('userInput').value;
        if (userInput.trim() !== '') {
            displayMessage('You', userInput);
            chatHistory += `User: ${userInput}\n`;
            socket.emit('user_message', { message: userInput, history: chatHistory });
            document.getElementById('userInput').value = '';
        }
    }

    function displayMessage(sender, message) {
        const chatContent = document.getElementById('chatContent');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatContent.appendChild(messageElement);
        chatContent.scrollTop = chatContent.scrollHeight;
    }
});
