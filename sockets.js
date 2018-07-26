const fs = require('fs'),
    cmd = require('child_process'),
    piCamera = require('./pi-camera');

module.exports = (io) => {
    let proc,
        isWatchingFile = false;

    const sockets = {},
        startStreaming = (io, options) => {
            options.output = './stream/image_stream.jpg';
            options.timelapse = 0;
            options.timeout = 999999999;

            console.log(piCamera.picture.options(options).join(' '));

            proc = cmd.spawn(piCamera.picture.command, piCamera.picture.options(options));
            isWatchingFile = true;

            const emitStream = () => {
                const time = (new Date()).getTime();
                io.sockets.emit('liveStream', 'stream/image_stream.jpg?_t=' + time);
            };

            fs.watchFile('./stream/image_stream.jpg', {interval: 0}, (current, previous) => {
                emitStream();
            })
        },
        stopStreaming = async () => {
            if (isWatchingFile) {
                isWatchingFile = false;
                if (proc) proc.kill();
                fs.unwatchFile('./stream/image_stream.jpg');
            }
        };

    io.on('connection', (socket) => {
        sockets[socket.id] = socket;
        console.log("connections: ", Object.keys(sockets).length);

        socket.on('disconnect', () => {
            delete sockets[socket.id];
            return stopStreaming();
        });

        socket.on('stream', (data) => {
            switch (data.command) {
                case 'start':
                    return stopStreaming().then(() => startStreaming(io, data.options));
                case 'stop':
                    return stopStreaming();
            }
        });
    });
};