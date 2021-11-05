import { XenceQuickKeys, VENDOR_ID, PRODUCT_IDS, XenceQuickKeysDevice } from '@xencelabs-quick-keys/core'
import * as HID from 'node-hid'
import { NodeHIDDevice, XenceQuickKeysInfo } from './device'
import { XenceQuickKeysNode } from './wrapper'

export {
	KeyIndex,
	XenceQuickKeys,
	XenceQuickKeysOrientation,
	WheelEvent,
	XenceQuickKeysWheelSpeed,
	XenceQuickKeysDisplayBrightness,
} from '@xencelabs-quick-keys/core'

export const DEVICE_INTERFACE = 2

/**
 * Scan for and list detected devices
 */
export function listXenceQuickKeys(): XenceQuickKeysInfo[] {
	const devices: XenceQuickKeysInfo[] = []
	for (const dev of HID.devices()) {
		if (
			dev.vendorId === VENDOR_ID &&
			dev.path &&
			dev.interface === DEVICE_INTERFACE &&
			PRODUCT_IDS.includes(dev.productId)
		) {
			devices.push({
				path: dev.path,
				// serialNumber: dev.serialNumber,
			})
		}
	}
	return devices
}

/**
 * Get the info of a device if the given path is a streamdeck
 */
export function getXenceQuickKeysInfo(path: string): XenceQuickKeysInfo | undefined {
	return listXenceQuickKeys().find((dev) => dev.path === path)
}

/**
 * Open a device
 * @param devicePath The path of the device to open. If not set, the first will be used
 */
export async function openXenceQuickKeys(devicePath?: string): Promise<XenceQuickKeys> {
	let foundDevices = listXenceQuickKeys()
	if (devicePath) {
		foundDevices = foundDevices.filter((d) => d.path === devicePath)
	}

	if (foundDevices.length === 0) {
		if (devicePath) {
			throw new Error(`Device "${devicePath}" was not found`)
		} else {
			throw new Error('No Xence Quick Keys are connected.')
		}
	}

	const device = new NodeHIDDevice(foundDevices[0])
	const rawSteamdeck = await XenceQuickKeysDevice.create(device)
	return new XenceQuickKeysNode(rawSteamdeck)
}
