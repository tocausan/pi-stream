const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    fs = require('fs'),
    path = require('path'),
    childProcess = require('child_process'),
    sockets = {};
let proc;

app.use('/', express.static(path.join(__dirname, 'stream')))
    .get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });


io.on('connection', (socket) => {
    sockets[socket.id] = socket;
    console.log("connections: ", Object.keys(sockets).length);

    socket.on('disconnect', () => {
        delete sockets[socket.id];

        stopStreaming();
    });

    socket.on('stream', (data) => {
        console.log(data);

        switch (data) {
            case 'start':
                startStreaming(io);
                break;
            case 'stop':
                stopStreaming();
                break;
        }
    });
});

http.listen(3000, () => {
    const ip = childProcess.exec('ifconfig | grep -Eo \'inet (addr:)?([0-9]*\\.){3}[0-9]*\' | grep -Eo \'([0-9]*\\.){3}[0-9]*\' | grep -v \'127.0.0.1\'',(err, stdout, stderr)=>{
        console.log('listening on ' + stdout.trim() + ':3000');
    });
});

function stopStreaming() {
    if (Object.keys(sockets).length == 0) {
        app.set('watchingFile', false);
        if (proc) proc.kill();
        fs.unwatchFile('./stream/image_stream.jpg');
    }
}

function startStreaming(io) {
    let time = (new Date()).getTime();
    if (app.get('watchingFile')) return io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + time);

    const args = ['-w', '1080', '-h', '810', '-o', './stream/image_stream.jpg', '-t', '999999999', '-tl', '0'];
    proc = childProcess.spawn('raspistill', args);

    app.set('watchingFile', true);

    fs.watchFile('./stream/image_stream.jpg', {interval: 0}, (current, previous) => {
        time = (new Date()).getTime();
        io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + time);
    })
}