// import { VENDOR_ID, PRODUCT_IDS, XencelabsQuickKeysDevice } from '@xencelabs-quick-keys/core'
// import * as HID from 'node-hid'
// import { NodeHIDDevice, XencelabsQuickKeysInfo } from './device'
// import { XencelabsQuickKeysNode } from './wrapper'

// export {
// 	KeyIndex,
// 	XencelabsQuickKeys,
// 	XencelabsQuickKeysDisplayOrientation,
// 	WheelEvent,
// 	XencelabsQuickKeysWheelSpeed,
// 	XencelabsQuickKeysDisplayBrightness,
// } from '@xencelabs-quick-keys/core'

export const DEVICE_INTERFACE = 2

// /**
//  * Scan for and list detected devices
//  */
// export function listXencelabsQuickKeys(): XencelabsQuickKeysInfo[] {
// 	const devices: XencelabsQuickKeysInfo[] = []
// 	for (const dev of HID.devices()) {
// 		if (
// 			dev.vendorId === VENDOR_ID &&
// 			dev.path &&
// 			dev.interface === DEVICE_INTERFACE &&
// 			PRODUCT_IDS.includes(dev.productId)
// 		) {
// 			devices.push({
// 				path: dev.path,
// 				// serialNumber: dev.serialNumber,
// 			})
// 		}
// 	}
// 	return devices
// }

// /**
//  * Get the info of a device if the given path is a compatible device
//  */
// export function getXencelabsQuickKeysInfo(path: string): XencelabsQuickKeysInfo | undefined {
// 	return listXencelabsQuickKeys().find((dev) => dev.path === path)
// }

// /**
//  * Open a device
//  * @param devicePath The path of the device to open. If not set, the first will be used
//  */
// export async function openXencelabsQuickKeys(devicePath?: string): Promise<XencelabsQuickKeysNode> {
// 	let foundDevices = listXencelabsQuickKeys()
// 	if (devicePath) {
// 		foundDevices = foundDevices.filter((d) => d.path === devicePath)
// 	}

// 	if (foundDevices.length === 0) {
// 		if (devicePath) {
// 			throw new Error(`Device "${devicePath}" was not found`)
// 		} else {
// 			throw new Error('No Xence Quick Keys are connected.')
// 		}
// 	}

// 	const device = new NodeHIDDevice(foundDevices[0])
// 	const innerDevice = await XencelabsQuickKeysDevice.create(device)
// 	return new XencelabsQuickKeysNode(innerDevice)
// }
