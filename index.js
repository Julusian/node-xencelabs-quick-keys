
const HID = require('node-hid')

// HID.setDriverType('libusb');


const devices = HID.devices(0x28bd, 0x5202)

console.log(devices)

const devInfo = devices.filter(d => d.interface === 2)
console.log('valid', devInfo)

const dev = new HID.HID(devInfo[0].path)
dev.on('data', (e) => {
    console.log('data', e)

    if (e.length !== 10 || e.readUint8(1) !== 0xf0) {
        console.error(`Bad packet, got ${e.length}, expected 10`)
        return
    }

    const wheelByte = e.readUint8(7)
    if (wheelByte > 0) {
        if (wheelByte & 0x01) {
            console.log('wheel +')
        } else if (wheelByte & 0x02) {
            console.log('wheel -')
        } else {
            console.log('wheel unknown')
        }
    } else {
        // looks like press data
        const data1 = e.readUint8(2)
        const data2 = e.readUint8(3)
        console.log('buttons', data1.toString(2).padStart(8, '0'), data2.toString(2).padStart(2, '0'))
    }
})
dev.on('error', (e) => {
    console.log('error', e)
})

// Enable key events
console.log('write', dev.write(Buffer.from([
    0x02, 0xb0, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
])))

// // First one - colour
// console.log('write', dev.write(Buffer.from([
//     0x02, 0xb4, 0x01, 0x01, 0x00, 0x00, /* */ 0x1c, 0x7d,
//     0x06, /* */ 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
// ])))

// // Second one - wheel speed
// console.log('write', dev.write(Buffer.from([
//     0x02, 0xb4, 0x04, 0x01, 0x01, 0x03, 0x00, 0x00,
//     0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
// ])))

// // Third one - set colour of dial
// console.log('write', dev.write(Buffer.from([
//     0x02, 0xb4, 0x01, 0x01, 0x00, 0x00, 0xaa, 0x00,
//     0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
//     0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
// ])))

function setWheelSpeed(val) {
    // valid range 1-5
    console.log('setWheelSpeed', val, dev.write(Buffer.from([
        0x02, 0xb4, 0x04, 0x01, 0x01, val,  0x00, 0x00,
        0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])))
}

function setOrientation(val) {
    // valid range 1-4
    console.log('setOrientation', val, dev.write(Buffer.from([
        0x02, 0xb1, val,  0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])))
}

function setScreenBrightness(val) {
    // valid range 0-3
    console.log('setScreenBrightness', val, dev.write(Buffer.from([
        0x02, 0xb1, 0x0a, 0x01, val,  0x00, 0x00, 0x00,
        0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])))
}

function setSleepTimer(val) {
    // valid range 0-255 minutes??
    // TODO - this may not work..
    console.log('setSleepTimer', val, dev.write(Buffer.from([
        0x02, 0xb4, 0x08, 0x01, val,  0x00, 0x00, 0x00,
        0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])))
}

setWheelSpeed(3)
setOrientation(2)
setScreenBrightness(1)
setSleepTimer(30)

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


function writeText(key, text) {
    text = text.substr(0, 8)
    const len = text.length * 2
    
    const buf = Buffer.from([
        0x02, 0xb1, 0x00, key,  0x00, len,  0x00, 0x00,
        0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
        // Text data goes here:
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])
    // load in the text 
    buf.write(text, 16, 'utf16le')

    // Should set text
    console.log('write', key, text, dev.write(buf))
}

function setColour(r,g,b) {
    console.log('colour', r,g,b, dev.write(Buffer.from([
        0x02, 0xb4, 0x01, 0x01, 0x00, 0x00, r, g,
        b, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])))
}

let tick = 0
function doTick() {
    tick++
    
    setColour(Math.random()*255,Math.random()*255,Math.random()*255)

    for (let i = 1; i <= 8; i++) {
        if (i === 1) {
            writeText(i, `tick ${tick}`)
        } else {
            writeText(i, makeid(8))
        }
    }
}
doTick()
// setInterval(doTick, 1000)

function writeTextOverlayChunk(duration, text, hasMore) {
    const buf2 = Buffer.from([
        0x02, 0xb1, 0x06, duration, 0x00, text.length * 2, hasMore ? 0x01 : 0x00, 0x00,
        0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
        // Text data goes here:
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])
    // load in the text 
    buf2.write(text, 16, 'utf16le')

    // Should set text
    console.log('largeText', text, hasMore, dev.write(buf2))
}

function writeTextOverlay(duration, text) {
    // duration valid 1-0xff?
    text = text.trim().substr(0, 8 * 4)

    const text1 = text.substr(0, 8)
    const len1 = text1.length * 2
    const buf = Buffer.from([
        0x02, 0xb1, 0x05, duration, 0x00, len1, 0x00, 0x00,
        0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa,
        // Text data goes here:
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
    ])
    // load in the text 
    buf.write(text1, 16, 'utf16le')

    // Should set text
    console.log('largeText', text1, dev.write(buf))

    writeTextOverlayChunk(duration, text.substr(8, 8), text.length > 16)

    for (let offset = 16; offset < text.length; offset += 8) {
        writeTextOverlayChunk(duration, text.substr(offset, 8), text.length > offset + 8)
    }

    // doTick()
}
// writeTextLarge('aaa')
setInterval(() => {
    // writeTextOverlay(2, tick + ' - Something long and cool here, is there no limit?')
}, 5000)