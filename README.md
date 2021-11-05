# @xencelabs-quick-keys

![Node CI](https://github.com/Julusian/node-xencelabs-quick-keys/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/Julusian/node-xencelabs-quick-keys/branch/master/graph/badge.svg?token=Hl4QXGZJMF)](https://codecov.io/gh/Julusian/node-xencelabs-quick-keys)

[@xencelabs-quick-keys](https://www.npmjs.com/org/xencelabs-quick-keys) is a collection of libraries for interfacing with the [Xencelabs Quick Keys](https://www.xencelabs.com/product/xencelabs-quick-keys-remote/).  
With WebHID being made publicly available it is now possible to use the Steam Deck directly in the browser.

## Intended use

This library has nothing to do with the software produced by manufacturer. There is nothing here to install and run. This is a library to help developers make alternatives to that software

## Installing & Usage

Check one of the installable packages for installation and usage instructions:

-   [`@xencelabs-quick-keys/node`](https://npm.im/@xencelabs-quick-keys/node)
-   [`@xencelabs-quick-keys/webhid`](https://npm.im/@xencelabs-quick-keys/webhid)

### Have another hid target you wish to use?

The existing implementations are a light wrapper around the platform agnostic [`@xencelabs-quick-keys/core`](https://npm.im/@xencelabs-quick-keys/core). You can use your own HID implementation and device scanning/opening logic and reuse all the device logic.

## Demo

If you are using a Chromium v89+ based browser, you can try out the [webhid demo](https://julusian.github.io/node-xencelabs-quick-keys/)

## Linux

On linux, the udev subsystem blocks access to the usb device without some special configuration.
Save the following to `/etc/udev/rules.d/50-xencelabs.rules` and reload the rules with `sudo udevadm control --reload-rules`

```
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="28bd", ATTRS{idProduct}=="5202", MODE:="666", GROUP="plugdev"
SUBSYSTEM=="usb", ATTRS{idVendor}=="28bd", ATTRS{idProduct}=="5203", MODE:="666", GROUP="plugdev"
KERNEL=="hidraw*", ATTRS{busnum}=="1", ATTRS{idVendor}=="28bd", ATTRS{idProduct}=="5202", MODE="0666"
KERNEL=="hidraw*", ATTRS{busnum}=="1", ATTRS{idVendor}=="28bd", ATTRS{idProduct}=="5203", MODE="0666"
```

## Contributing

The xencelabs-quick-keys team enthusiastically welcomes contributions and project participation! There's a bunch of things you can do if you want to contribute! Please don't hesitate to jump in if you'd like to, or even ask us questions if something isn't clear.

Please refer to the [Changelog](CHANGELOG.md) for project history details, too.
