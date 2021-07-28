const express = require('express');
const app = express();
const port = 5000;

app.use(express.static('public'));

app.use('/js', express.static(__dirname + 'public/js'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

let server = app.listen(port, function () {

    console.info(`App listening on port ${port}`);

});

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
const users = {}

io.on('connection', socket => {
    socket.on('disconnect', data => {
        console.log('deleting', socket.id);
        delete users[socket.id];
        socket.broadcast.emit('user-list', users);

    })

    socket.on('new-user', name => {
        users[socket.id] = name;

        // socket.broadcast.emit('user-connected', { name: name, socketId: socket.id });
        socket.broadcast.emit('user-list', users);
        socket.emit('user-list', users);
    })

    socket.on('send-chat-message', data => {
        // socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
        console.log('chat', data);
        io.to(data.to).emit('chat-message', { message: data.message, name: users[data.from] });
    });
});