const fs = require('fs'),
    cmd = require('child_process');

module.exports = (io) => {
    let proc,
        isWatchingFile = false;

    const sockets = {},
        startStreaming = (io, options) => {
            const args = [
                '-n',
                '-o', './stream/image_stream.jpg',
                '-t', '999999999',
            ];

            if (options !== undefined && options !== null) {
                if (options.timelapse !== undefined) args.push('--timelapse', options.timelapse);
                if (options.width !== undefined) args.push('--width', options.width);
                if (options.height !== undefined) args.push('--height', options.height);
                if (options.quality !== undefined) args.push('--quality', options.quality);
                if (options.burst !== undefined) args.push('--burst', options.burst);
                if (options.sharpness !== undefined) args.push('--sharpness', options.sharpness);
                if (options.brightness !== undefined) args.push('--brightness', options.brightness);
                if (options.saturation !== undefined) args.push('--saturation', options.saturation);
                if (options.vstab !== undefined) args.push('--vstab', options.vstab);
                if (options.ev !== undefined) args.push('--ev', options.ev);
                if (options.colfx !== undefined) args.push('--colfx', options.colfx);
                if (options.rotation !== undefined) args.push('--rotation', options.rotation);
                if (options.hflip !== undefined) args.push('--hflip', options.hflip);
                if (options.vflip !== undefined) args.push('--vflip', options.vflip);
                if (options.roi !== undefined) args.push('--roi', options.roi);
                if (options.shutter !== undefined) args.push('--shutter', options.shutter);
                if (options.awbgains !== undefined) args.push('--awbgains', options.awbgains);
                if (options.drc !== undefined) args.push('--drc', options.drc);
            }

            console.log(args.join(' '));

            // proc = cmd.spawn('raspistill', args);
            isWatchingFile = true;

            const emitStream = () => {
                const time = (new Date()).getTime();
                io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + time);
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
            console.log(data);

            switch (data.command) {
                case 'start':
                    return stopStreaming().then(() => startStreaming(io, data.options));
                case 'stop':
                    return stopStreaming();
            }
        });
    });
};