const express = require('express');
const app = express();
 
const http = require('http');
const server = http.Server(app);
 
const socket = require('socket.io');
const io = socket(server);
 
const port = 5000;
let nameIdx = [];
let nickname = new Map();
let room = new Map();
let socketList = [];

app.get('/', (req, resp) => {
    resp.send('hello :)');
});
 
io.on('connection', (socket) => {
    
    
    socket.on('set room', (data) => {
        console.log('User Join');
        socket.join(data.room, () => {
            // nameIdx.push(data.idx);
            nickname.set(socket.id, data.nickname);
            room.set(socket.id, data.room);

            socketList.push(socket);

            console.log(data.nickname+' 님 '+data.room+' 으로 입장' );
        });
    });
 
    socket.on('SEND', (msgData) => {
        console.log(msgData);
        
        //나를 제외한 모든 사람에게 보내기.
        socketList.forEach((item, i) => {
            // console.log('id',item.id);
            if(item != socket){
                // item.emit('SEND', msg);

                // msgData: room, nickname, parsedate, msg
                item.emit('SEND', msgData.nickname, msgData.msg, new Date().toString());
            }
        });
    });

    socket.on('disconnect', () =>{
        // socketList.splice(socketList.indexOf(socket), 1);
        io.to(room.get(socket.id)).emit('leave chat Room', )
    });
});
 
server.listen(port, () => {
    console.log('Server On !');
});
