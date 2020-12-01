var app = require('express')();
var http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const chatListActive = {}

app.get('/', (req, res) => {
    res.send('hola')
});

//buscar un chat por id en chatListActive
const findChat = idChat => {
    return chatListActive[`${idChat}`]
}

//ingresar un nuevo chat a la lista de chats activos
const insertChatList = (idChat, idUser, skt) => {
    try {
        const chat = findChat(idChat)
        if (chat) {
            chatListActive[`${idChat}`][`${idUser}`] = skt
        } else {
            chatListActive[`${idChat}`] = { [idUser]: skt }
        }
    } catch (error) {
        console.log(e.message)
    }
}

//buscar idChat e idUser para un socket cliente conectado
const findChatUserBySocket = idSocket => {
    const idsChats = Object.keys(chatListActive)
    for (let i = 0; i < idsChats.length; i++) {
        let idChat = idsChats[i];
        let idsUsers = Object.keys(chatListActive[`${idChat}`])
        for (let j = 0; j < idsUsers.length; j++) {
            let idUser = idsUsers[j];
            if (chatListActive[`${idChat}`][`${idUser}`].id == idSocket) {
                return { idChat, idUser }
            }
        }
    }
    return null
}

const findSocketByChatUser = (idChat, idUser) => {
    try {
        return chatListActive[`${idChat}`][`${idUser}`]
    } catch (error) {
        return null
    }
}

io.on('connection', (socket) => {
    const socketId = socket.id
    const { idChat, idUser } = socket.request._query
    let socketPrev = findSocketByChatUser(idChat, idUser)
    if (socketPrev) {
        console.log(socketPrev.id, 'se está desconectando')
        socketPrev.disconnect()
    }
    insertChatList(idChat, idUser, socket)
    socket.on('conectado', (data) => {
        console.log('New user, data:', socketId, idUser, idChat, data)
    })
    socket.on('disconnect', () => {
        const { idChat, idUser } = findChatUserBySocket(socketId)
        const sizeUsersInChat = Object.keys(chatListActive[`${idChat}`]).length
        if (sizeUsersInChat === 1) {
            delete chatListActive[`${idChat}`]
        } else {
            delete chatListActive[`${idChat}`][`${idUser}`]
        }
        console.log(socket.id, 'se desconecto')
    })
    socket.on('mensaje', data => {
        io.emit('mensajes', data)
    })
});

http.listen(5000, () => {
    console.log('listening on 5000');
});