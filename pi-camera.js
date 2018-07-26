module.exports = {
    picture: {
        command: 'raspistill',
        options: (data) => {
            const options = [];
            if (data !== undefined && data !== null) {
                // Image parameter commands
                // -w, --width	: Set image width <size>
                if (data.width !== undefined && data.width !== null)
                    options.push('--width', Math.max(100, parseInt(data.width)));

                // -h, --height	: Set image height <size>
                if (data.height !== undefined && data.height !== null)
                    options.push('--height', Math.max(100, parseInt(data.height)));

                //-q, --quality	: Set jpeg quality <0 to 100>
                if (data.quality !== undefined && data.quality !== null)
                    options.push('--quality', Math.max(0, Math.min(100, parseInt(data.quality))));

                // -r, --raw	: Add raw bayer data to jpeg metadata
                if (data.raw !== undefined && data.raw !== null)
                    options.push('--raw');

                // -o, --output	: Output filename <filename> (to write to stdout, use '-o -'). If not specified, no file is saved
                if (data.output !== undefined && data.output !== null)
                    options.push('--output', data.output.toString());

                // -l, --latest	: Link latest complete image to filename <filename>

                // -v, --verbose	: Output verbose information during run
                if (data.verbose !== undefined && data.verbose !== null)
                    options.push('--verbose');

                // -t, --timeout	: Time (in ms) before takes picture and shuts down (if not specified, set to 5s)
                if (data.timeout !== undefined && data.timeout !== null)
                    options.push('--timeout', parseInt(data.timeout));

                // -th, --thumb	: Set thumbnail parameters (x:y:quality) or none
                // -d, --demo	: Run a demo mode (cycle through range of camera options, no capture)
                // -e, --encoding	: Encoding to use for output file (jpg, bmp, gif, png)
                // -x, --exif	: EXIF tag to apply to captures (format as 'key=value') or none

                // -tl, --timelapse	: Timelapse mode. Takes a picture every <t>ms. %d == frame number (Try: -o img_%04d.jpg)
                if (data.timelapse !== undefined && data.timelapse !== null)
                    options.push('--timelapse', parseInt(data.timelapse));

                // -fp, --fullpreview	: Run the preview using the still capture resolution (may reduce preview fps)
                // -k, --keypress	: Wait between captures for a ENTER, X then ENTER to exit
                // -s, --signal	: Wait between captures for a SIGUSR1 or SIGUSR2 from another process
                // -g, --gl	: Draw preview to texture instead of using video render component
                // -gc, --glcapture	: Capture the GL frame-buffer instead of the camera image
                // -set, --settings	: Retrieve camera settings and write to stdout
                // -cs, --camselect	: Select camera <number>. Default 0
                // -bm, --burst	: Enable 'burst capture mode'

                // -md, --mode	: Force sensor mode. 0=auto. See docs for other modes available
                // -dt, --datetime	: Replace output pattern (%d) with DateTime (MonthDayHourMinSec)
                // -ts, --timestamp	: Replace output pattern (%d) with unix timestamp (seconds since 1970)
                // -fs, --framestart	: Starting frame number in output pattern(%d)
                // -rs, --restart	: JPEG Restart interval (default of 0 for none)

                // Preview parameter commands

                // -p, --preview	: Preview window settings <'x,y,w,h'>
                // -f, --fullscreen	: Fullscreen preview mode
                // -op, --opacity	: Preview window opacity (0-255)
                // -n, --nopreview	: Do not display a preview window

                // Image parameter commands

                // -sh, --sharpness	: Set image sharpness (-100 to 100)
                if (data.sharpness !== undefined && data.sharpness !== null)
                    options.push('--sharpness', Math.max(-100, Math.min(100, parseInt(data.quality))));

                // -co, --contrast	: Set image contrast (-100 to 100)
                if (data.contrast !== undefined && data.contrast !== null)
                    options.push('--contrast', Math.max(-100, Math.min(100, parseInt(data.contrast))));

                // -br, --brightness	: Set image brightness (0 to 100)
                if (data.brightness !== undefined && data.brightness !== null)
                    options.push('--brightness', Math.max(0, Math.min(100, parseInt(data.brightness))));

                // -sa, --saturation	: Set image saturation (-100 to 100)
                if (data.saturation !== undefined && data.saturation !== null)
                    options.push('--saturation', Math.max(-100, Math.min(100, parseInt(data.saturation))));

                // -ISO, --ISO	: Set capture ISO
                if (data.iso !== undefined && data.iso !== null)
                    options.push('--ISO', parseInt(data.iso));

                // -vs, --vstab	: Turn on video stabilisation
                // -ev, --ev	: Set EV compensation - steps of 1/6 stop

                // -ex, --exposure	: Set exposure mode (see Notes)
                if (data.exposure !== undefined && data.exposure !== null) {
                    const list = ['off', 'auto', 'night', 'nightpreview', 'backlight', 'spotlight', 'sports', 'snow', 'beach', 'verylong', 'fixedfps', 'antishake', 'fireworks'];
                    if (list.find(item => item === data.exposure.toString()) !== undefined)
                        options.push('--exposure', data.exposure.toString());
                }

                // -fli, --flicker	: Set flicker avoid mode (see Notes)
                if (data.flicker !== undefined && data.flicker !== null) {
                    const list = ['off', 'auto', '50hz', '60hz'];
                    if (list.find(item => item === data.flicker.toString()) !== undefined)
                        options.push('--flicker', data.flicker.toString());
                }

                // -awb, --awb	: Set AWB mode (see Notes)
                if (data.awb !== undefined && data.awb !== null) {
                    const list = ['off', 'auto', 'sun', 'cloud', 'shade', 'tungsten', 'fluorescent', 'incandescent', 'flash', 'horizon'];
                    if (list.find(item => item === data.awb.toString()) !== undefined)
                        options.push('--awb', data.awb.toString());
                }

                // -ifx, --imxfx	: Set image effect (see Notes)
                if (data.imxfx !== undefined && data.imxfx !== null) {
                    const list = ['none', 'negative', 'solarise', 'sketch', 'denoise', 'emboss', 'oilpaint', 'hatch', 'gpen', 'pastel', 'watercolour', 'film', 'blur', 'saturation', 'colourswap', 'washedout', 'posterise', 'colourpoint', 'colourbalance', 'cartoon'];
                    if (list.find(item => item === data.imxfx.toString()) !== undefined)
                        options.push('--imxfx', data.imxfx.toString());
                }

                // -cfx, --colfx	: Set colour effect (U:V)

                // -mm, --metering	: Set metering mode (see Notes)
                if (data.metering !== undefined && data.metering !== null) {
                    const list = ['average', 'spot', 'backlit', 'matrix'];
                    if (list.find(item => item === data.metering.toString()) !== undefined)
                        options.push('--metering', data.metering.toString());
                }

                // -rot, --rotation	: Set image rotation (0-359)
                if (data.rotation !== undefined && data.rotation !== null)
                    options.push('--rotation', Math.max(0, Math.min(359, parseInt(data.rotation))));

                // -hf, --hflip	: Set horizontal flip
                if (data.hflip !== undefined && data.hflip !== null)
                    options.push('--hflip');

                // -vf, --vflip	: Set vertical flip
                if (data.vflip !== undefined && data.vflip !== null)
                    options.push('--vflip');

                // -roi, --roi	: Set region of interest (x,y,w,d as normalised coordinates [0.0-1.0])
                // -ss, --shutter	: Set shutter speed in microseconds
                // -awbg, --awbgains	: Set AWB gains - AWB mode must be off
                // -drc, --drc	: Set DRC Level (see Notes)
                // -st, --stats	: Force recomputation of statistics on stills capture pass

                // -a, --annotate	: Enable/Set annotate flags or text
                if (data.annotate !== undefined && data.annotate !== null)
                    options.push('--annotate', data.annotate.toString());

                // -3d, --stereo	: Select stereoscopic mode
                if (data.stereo !== undefined && data.stereo !== null)
                    options.push('--stereo');

                // -dec, --decimate	: Half width/height of stereo image
                // -3dswap, --3dswap	: Swap camera order for stereoscopic
                // -ae, --annotateex	: Set extra annotation parameters (text size, text colour(hex YUV), bg colour(hex YUV))
                // -ag, --analoggain	: Set the analog gain (floating point)
                // -dg, --digitalgain	: Set the digital gain (floating point)
            }
            return options;
        }
    }
};

/*

Notes
Dynamic Range Compression (DRC) options :
off,low,med,high

*/