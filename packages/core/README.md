# @xencelabs-quick-keys/core

![Node CI](https://github.com/Julusian/node-xencelabs-quick-keys/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/Julusian/node-xencelabs-quick-keys/branch/master/graph/badge.svg?token=Hl4QXGZJMF)](https://codecov.io/gh/Julusian/node-xencelabs-quick-keys)

[![npm version](https://img.shields.io/npm/v/@xencelabs-quick-keys/core.svg)](https://npm.im/@xencelabs-quick-keys/core)
[![license](https://img.shields.io/npm/l/@xencelabs-quick-keys/core.svg)](https://npm.im/@xencelabs-quick-keys/core)

[`@xencelabs-quick-keys/core`](https://github.com/julusian/node-xencelabs-quick-keys) is a shared library for interfacing
with the various models of the [Xencelabs Quick Keys](https://www.xencelabs.com/product/xencelabs-quick-keys-remote/).

You should not be importing this package directly, instead you will want to do so via one of the wrapper libraries to provide the appropriate HID bindings for your target platform:

-   [`@xencelabs-quick-keys/node`](https://npm.im/@xencelabs-quick-keys/node)
-   [`@xencelabs-quick-keys/webhid`](https://npm.im/@xencelabs-quick-keys/webhid)
