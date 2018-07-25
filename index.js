const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    cmd = require('child_process');

require('./sockets')(io);

app.use('/bower', express.static(path.join(__dirname, 'bower_components')))
    .use('/stream', express.static(path.join(__dirname, 'stream')))
    .get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });

http.listen(3000, () => {
    cmd.exec('ifconfig | ' +
        'grep -Eo \'inet (addr:)?([0-9]*\\.){3}[0-9]*\' | ' +
        'grep -Eo \'([0-9]*\\.){3}[0-9]*\' | ' +
        'grep -v \'127.0.0.1\'', (err, stdout, stderr) => {
        console.log('listening on ' + stdout.trim() + ':3000');
    });
});
