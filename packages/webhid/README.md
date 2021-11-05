# @xencelabs-quick-keys/webhid

![Node CI](https://github.com/Julusian/node-xencelabs-quick-keys/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/Julusian/node-xencelabs-quick-keys/branch/master/graph/badge.svg?token=Hl4QXGZJMF)](https://codecov.io/gh/Julusian/node-xencelabs-quick-keys)

[![npm version](https://img.shields.io/npm/v/@xencelabs-quick-keys/webhid.svg)](https://npm.im/@xencelabs-quick-keys/webhid)
[![license](https://img.shields.io/npm/l/@xencelabs-quick-keys/webhid.svg)](https://npm.im/@xencelabs-quick-keys/webhid)

[`@xencelabs-quick-keys/webhid`](https://github.com/julusian/node-xencelabs-quick-keys) is a shared library for interfacing
with the various models of the [Xencelabs Quick Keys](https://www.xencelabs.com/product/xencelabs-quick-keys-remote/).

## Intended use

This library has nothing to do with the software produced by the manufacturer. There is nothing here to install and run. This is a library to help developers make alternatives to that software

## Install

`$ npm install --save @xencelabs-quick-keys/webhid`

### Important

You need to provide a Buffer polyfill to the browser for this library. We recommend using [buffer](https://www.npmjs.com/package/buffer) which can be added to your webpack config with:

```
plugins: [
	new ProvidePlugin({
		Buffer: ['buffer', 'Buffer'],
	}),
],
```

## Linux

On linux, the udev subsystem blocks access to the device without some special configuration.
Save the following to `/etc/udev/rules.d/50-xencelabs.rules` and reload the rules with `sudo udevadm control --reload-rules`

```
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="28bd", ATTRS{idProduct}=="5202", MODE:="666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTRS{idVendor}=="28bd", ATTRS{idProduct}=="5203", MODE:="666", GROUP="plugdev"
KERNEL=="hidraw*", ATTRS{busnum}=="1", ATTRS{idVendor}=="28bd", ATTRS{idProduct}=="5202", MODE="0666"
KERNEL=="hidraw*", ATTRS{busnum}=="1", ATTRS{idVendor}=="28bd", ATTRS{idProduct}=="5203", MODE="0666"

```

Unplug and replug the device and it should be usable

## Features

-   Key `down` and key `up` events
-   Wheel turn events
-   Set text labels of buttons
-   Show text overlays
-   Set the wheel speed
-   Set the display orientation
-   Set the display brightness
-   Set the wheel color
-   TypeScript support

### Known limitations

-   Only works with Chromium v89+ based browsers
-   The original model of the 15key is not supported on linux
-   When having a hid device open, you will still be subject to background tab throttling which affects the draw rate

## API

The root methods exposed by the library are as follows. For more information it is recommended to rely on the typescript typings for hints or to browse through the source to see what methods are available

```typescript
/**
 * Request the user to select some devices to open
 */
export async function requestXenceQuickKeys(): Promise<XenceQuickKeysWeb[]>

/**
 * Reopen previously selected devices.
 * The browser remembers what the user previously allowed your site to access, and this will open those without the request dialog
 */
export async function getXenceQuickKeys(): Promise<XenceQuickKeysWeb[]>

/**
 * Open a device from a manually selected HIDDevice handle
 * @param browserDevice The unopened browser HIDDevice
 */
export async function openDevice(browserDevice: HIDDevice): Promise<XenceQuickKeysWeb>
```

The XenceQuickKeys type can be found [here](/packages/core/src/types.ts#L15)

## Example

```typescript
import { requestXenceQuickKeys } from '@xencelabs-quick-keys/webhid'

// Prompts the user to select a device to use
const myDevices = await requestXenceQuickKeys()

myDevices[0].on('down', (keyIndex) => {
	console.log('key %d down', keyIndex)
})

myDevices[0].on('up', (keyIndex) => {
	console.log('key %d up', keyIndex)
})

myDevices[0].on('wheel', (e) => {
	console.log('wheel %s', e)
})

// Fired whenever an error is detected by the hid device.
// Always add a listener for this event! If you don't, errors will be silently dropped.
myDevices[0].on('error', (error) => {
	console.error(error)
})

// Fill the first button text. This is asynchronous.
await myDevices[0].setKeyText(4, 'test')
console.log('Successfully wrote text to key 4.')
```

Some the [demo site](https://julusian.github.io/node-xencelabs-quick-keys/) for some more complete examples and its corresponding [source](/packages/webhid-demo).

## Contributing

The xencelabs-quick-keys team enthusiastically welcomes contributions and project participation! There's a bunch of things you can do if you want to contribute! Please don't hesitate to jump in if you'd like to, or even ask us questions if something isn't clear.

Please refer to the [Changelog](CHANGELOG.md) for project history details, too.
