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
                if (options.timelapse !== undefined && options.timelapse !== null)
                    args.push('--timelapse', options.timelapse);
                if (options.width !== undefined && options.width !== null)
                    args.push('--width', options.width);
                if (options.height !== undefined && options.height !== null)
                    args.push('--height', options.height);
                if (options.quality !== undefined && options.quality !== null)
                    args.push('--quality', options.quality);
                if (options.burst !== undefined && options.burst !== null)
                    args.push('--burst', options.burst);
                if (options.sharpness !== undefined && options.sharpness !== null)
                    args.push('--sharpness', options.sharpness);
                if (options.brightness !== undefined && options.brightness !== null)
                    args.push('--brightness', options.brightness);
                if (options.saturation !== undefined && options.saturation !== null)
                    args.push('--saturation', options.saturation);
                if (options.vstab !== undefined && options.vstab !== null)
                    args.push('--vstab', options.vstab);
                if (options.ev !== undefined && options.ev !== null)
                    args.push('--ev', options.ev);
                if (options.colfx !== undefined && options.colfx !== null)
                    args.push('--colfx', options.colfx);
                if (options.rotation !== undefined && options.rotation !== null)
                    args.push('--rotation', options.rotation);
                if (options.hflip !== undefined && options.hflip !== null)
                    args.push('--hflip', options.hflip);
                if (options.vflip !== undefined && options.vflip !== null)
                    args.push('--vflip', options.vflip);
                if (options.roi !== undefined && options.roi !== null)
                    args.push('--roi', options.roi);
                if (options.shutter !== undefined && options.shutter !== null)
                    args.push('--shutter', options.shutter);
                if (options.awbgains !== undefined && options.awbgains !== null)
                    args.push('--awbgains', options.awbgains);
                if (options.drc !== undefined && options.drc !== null)
                    args.push('--drc', options.drc);
            }

            console.log(args.join(' '));

            proc = cmd.spawn('raspistill', args);
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