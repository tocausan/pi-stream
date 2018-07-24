const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn;

let proc;

app.use('/', express.static(path.join(__dirname, 'stream')));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const sockets = {};

io.on('connection', (socket) => {
    sockets[socket.id] = socket;
    console.log("Total clients connected : ", Object.keys(sockets).length);

    socket.on('disconnect', function () {
        delete sockets[socket.id];

        // no more sockets, kill the stream
        if (Object.keys(sockets).length == 0) {
            app.set('watchingFile', false);
            if (proc) proc.kill();
            fs.unwatchFile('./stream/image_stream.jpg');
        }
    });

    socket.on('start-stream', () => {
        startStreaming(io);
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

function stopStreaming() {
    if (Object.keys(sockets).length == 0) {
        app.set('watchingFile', false);
        if (proc) proc.kill();
        fs.unwatchFile('./stream/image_stream.jpg');
    }
}

function startStreaming(io) {
    if (app.get('watchingFile')) return io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));

    const args = ['-w', '640', '-h', '480', '-o', './stream/image_stream.jpg', '-t', '999999999', '-tl', '100', '-br', '50'];
    proc = spawn('raspistill', args);

    console.log('Watching for changes...');

    app.set('watchingFile', true);

    fs.watchFile('./stream/image_stream.jpg', (current, previous) => {
        const n = Math.random() * 100000;
        console.log(n);
        io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + n);
    })

}