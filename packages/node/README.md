# @xencelabs-quick-keys/node

![Node CI](https://github.com/Julusian/node-xencelabs-quick-keys/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/Julusian/node-xencelabs-quick-keys/branch/master/graph/badge.svg?token=Hl4QXGZJMF)](https://codecov.io/gh/Julusian/node-xencelabs-quick-keys)

[![npm version](https://img.shields.io/npm/v/@xencelabs-quick-keys/node.svg)](https://npm.im/@xencelabs-quick-keys/node)
[![license](https://img.shields.io/npm/l/@xencelabs-quick-keys/node.svg)](https://npm.im/@xencelabs-quick-keys/node)

[`@xencelabs-quick-keys/node`](https://github.com/julusian/node-xencelabs-quick-keys) is a shared library for interfacing
with the various models of the [Xencelabs Quick Keys](https://www.xencelabs.com/product/xencelabs-quick-keys-remote/).

## Intended use

This library has nothing to do with the software produced by the manufacturer. There is nothing here to install and run. This is a library to help developers make alternatives to that software

## Install

`$ npm install --save @xencelabs-quick-keys/node`

### Native dependencies

All of this library's native dependencies ship with prebuilt binaries, so having a full compiler toolchain should not be necessary to install `@xencelabs-quick-keys/node`.

However, in the event that installation _does_ fail (**or if you are on a platform that our dependencies don't provide prebuilt binaries for, such as a Raspberry Pi**), you will need to install a compiler toolchain to enable npm to build some of `@xencelabs-quick-keys/node`'s dependencies from source. Expand the details block below for full instructions on how to do so.

<details>
	<summary>Compiling dependencies from source</summary>
	
* Windows
  * Install [`windows-build-tools`](https://github.com/felixrieseberg/windows-build-tools):
  ```bash
  npm install --global windows-build-tools
  ```
* MacOS
  * Install the Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```
* Linux (**including Raspberry Pi**)
  * Follow the instructions for Linux in the ["Compiling from source"](https://github.com/node-hid/node-hid#compiling-from-source) steps for 
  * Try installing `@xencelabs-quick-keys/node`
  * If you still have issues, ensure everything is updated and try again:
	```bash
	sudo apt-get update && sudo apt-get upgrade
	```
</details>

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

-   Multiplatform support: Windows, MacOS, Linux, and even Raspberry Pi!
-   Key `down` and key `up` events
-   Wheel turn events
-   Set text labels of buttons
-   Show text overlays
-   Set the wheel speed
-   Set the display orientation
-   Set the display brightness
-   Set the wheel color
-   TypeScript support

## API

The root methods exposed by the library are as follows. For more information it is recommended to rely on the typescript typings for hints or to browse through the source to see what methods are available

```typescript
/**
 * Scan for and list detected devices
 */
export function listStreamDecks(): XenceQuickKeysInfo[]

/**
 * Get the info of a device if the given path is a streamdeck
 */
export function getStreamDeckInfo(path: string): XenceQuickKeysInfo | undefined

/**
 * Open a streamdeck
 * @param devicePath The path of the device to open. If not set, the first will be used
 * @param userOptions Options to customise the device behvaiour
 */
export function openStreamDeck(devicePath?: string, userOptions?: OpenStreamDeckOptionsNode): StreamDeck
```

The StreamDeck type can be found [here](/packages/core/src/models/types.ts#L15)

## Example

```typescript
import { openStreamDeck } from '@xencelabs-quick-keys/node'

// Automatically discovers connected devices, and attaches to the first one.
// Throws if there are no connected devices.
// You also have the option of providing the devicePath yourself as the first argument to the constructor.
// For example: const myStreamDeck = new StreamDeck('\\\\?\\hid#vid_05f3&pid_0405&mi_00#7&56cf813&0&0000#{4d1e55b2-f16f-11cf-88cb-001111000030}')
// On linux the equivalent would be: const myStreamDeck = new StreamDeck('0001:0021:00')
// Available devices can be found with listStreamDecks()
const myStreamDeck = await openStreamDeck() // Will throw an error if no compatible devices are connected.

myStreamDeck.on('down', (keyIndex) => {
	console.log('key %d down', keyIndex)
})

myStreamDeck.on('up', (keyIndex) => {
	console.log('key %d up', keyIndex)
})

// Fired whenever an error is detected by the `node-hid` library.
// Always add a listener for this event! If you don't, errors will be silently dropped.
myStreamDeck.on('error', (error) => {
	console.error(error)
})

// Fill the first button form the left in the first row with a solid red color. This is asynchronous.
await myStreamDeck.fillKeyColor(4, 255, 0, 0)
console.log('Successfully wrote a red square to key 4.')
```

Some more complex demos can be found in the [examples](examples/) folder.

## Contributing

The xencelabs-quick-keys team enthusiastically welcomes contributions and project participation! There's a bunch of things you can do if you want to contribute! Please don't hesitate to jump in if you'd like to, or even ask us questions if something isn't clear.

Please refer to the [Changelog](CHANGELOG.md) for project history details, too.
