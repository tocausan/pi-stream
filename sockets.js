const fs = require('fs'),
    cmd = require('child_process');

module.exports = (io) => {
    let proc,
        isWatchingFile = false;

    const sockets = {},
        startStreaming = (io, options) => {
            const args = [
                '-o', './stream/image_stream.jpg',
                '-t', '999999999',
                '-w', '1080',
                '-h', '810',
                '-tl', '0'
            ];

            if (options !== undefined && options !== null) {
                if (options.timelapse) args.push('--timelapse', options.timelapse);
                if (options.width) args.push('--width', options.width);
                if (options.height) args.push('--height', options.height);
                if (options.quality) args.push('--quality', options.quality);
                if (options.burst) args.push('--burst', options.burst);
                if (options.sharpness) args.push('--sharpness', options.sharpness);
                if (options.brightness) args.push('--brightness', options.brightness);
                if (options.saturation) args.push('--saturation', options.saturation);
                if (options.vstab) args.push('--vstab', options.vstab);
                if (options.ev) args.push('--ev', options.ev);
                if (options.colfx) args.push('--colfx', options.colfx);
                if (options.rotation) args.push('--rotation', options.rotation);
                if (options.hflip) args.push('--hflip', options.hflip);
                if (options.vflip) args.push('--vflip', options.vflip);
                if (options.roi) args.push('--roi', options.roi);
                if (options.shutter) args.push('--shutter', options.shutter);
                if (options.awbgains) args.push('--awbgains', options.awbgains);
                if (options.drc) args.push('--drc', options.drc);
            }


            proc = cmd.spawn('raspistill', args);
            isWatchingFile = true;

            fs.watchFile('./stream/image_stream.jpg', {interval: 0}, (current, previous) => {
                const time = (new Date()).getTime();
                io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + time);
            })
        },
        stopStreaming = () => {
            if (Object.keys(sockets).length == 0) {
                isWatchingFile = false;
                if (proc) proc.kill();
                fs.unwatchFile('./stream/image_stream.jpg');
            }
        };

    io.on('connection', (socket) => {
        sockets[socket.id] = socket;
        console.log("connections: ", Object.keys(sockets).length);
        startStreaming(io);

        socket.on('disconnect', () => {
            delete sockets[socket.id];
            stopStreaming();
        });

        socket.on('stream', (data) => {
            console.log(data);

            switch (data.command) {
                case 'start':
                    stopStreaming();
                    startStreaming(io, data.options);
                    break;
                case 'stop':
                    stopStreaming();
                    break;
            }
        });
    });
};