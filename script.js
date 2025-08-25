let socket;
let nickname = '';

function setNickname() {
    const input = document.getElementById('nickname');
    nickname = input.value.trim();
    if (nickname) {
        document.getElementById('nickname-input').style.display = 'none';
        document.getElementById('message-input').style.display = 'flex';
        document.getElementById('message').focus();
        connectToServer();
    } else {
        alert('请输入有效的昵称！');
    }
}

function connectToServer() {
    // 连接到WebSocket服务器
    // 注意：部署到GitHub Pages时需要更改为实际的服务器地址
    // 替换为您的Vercel项目URL
// 格式: wss://your-project-name.vercel.app/ws
socket = new WebSocket('https://one-theta-lake.vercel.app/');

    socket.onopen = function() {
        console.log('连接已建立');
        // 发送用户加入信息
        const joinMessage = JSON.stringify({
            type: 'join',
            nickname: nickname
        });
        socket.send(joinMessage);
    };

    socket.onmessage = function(event) {
        const message = JSON.parse(event.data);
        displayMessage(message);
    };

    socket.onclose = function() {
        console.log('连接已关闭');
        displaySystemMessage('与服务器的连接已断开，请刷新页面重试。');
    };

    socket.onerror = function(error) {
        console.error('发生错误:', error);
        displaySystemMessage('连接服务器时发生错误，请稍后再试。');
    };
}

function sendMessage() {
    const input = document.getElementById('message');
    const messageText = input.value.trim();
    if (messageText && socket && socket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({
            type: 'message',
            content: messageText,
            nickname: nickname
        });
        socket.send(message);
        input.value = '';
    }
}

function displayMessage(message) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if (message.type === 'join') {
        messageDiv.classList.add('system');
        messageDiv.textContent = `${message.nickname} 加入了聊天室`;
    } else if (message.type === 'leave') {
        messageDiv.classList.add('system');
        messageDiv.textContent = `${message.nickname} 离开了聊天室`;
    } else if (message.type === 'message') {
        if (message.nickname === nickname) {
            messageDiv.classList.add('user');
            messageDiv.textContent = `${message.content}`;
        } else {
            messageDiv.classList.add('other');
            messageDiv.textContent = `${message.nickname}: ${message.content}`;
        }
    }

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function displaySystemMessage(text) {
    const messagesDiv = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'system');
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 允许按Enter键发送消息
document.getElementById('nickname').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        setNickname();
    }
});

document.getElementById('message').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 页面关闭时关闭WebSocket连接
window.addEventListener('beforeunload', function() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const leaveMessage = JSON.stringify({
            type: 'leave',
            nickname: nickname
        });
        socket.send(leaveMessage);
        socket.close();
    }
});