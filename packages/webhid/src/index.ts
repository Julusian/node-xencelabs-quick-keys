import { VENDOR_ID, PRODUCT_IDS, XencelabsQuickKeysDevice } from '@xencelabs-quick-keys/core'
import { WebHIDDevice } from './device'
import { XencelabsQuickKeysWeb } from './wrapper'

export {
	KeyIndex,
	XencelabsQuickKeys,
	XencelabsQuickKeysDisplayOrientation,
	WheelEvent,
	XencelabsQuickKeysWheelSpeed,
	XencelabsQuickKeysDisplayBrightness,
} from '@xencelabs-quick-keys/core'
export { XencelabsQuickKeysWeb } from './wrapper'

/**
 * Request the user to select some devices to open
 */
export async function requestXencelabsQuickKeys(): Promise<XencelabsQuickKeysWeb[]> {
	// TODO - error handling
	return navigator.hid
		.requestDevice({
			filters: PRODUCT_IDS.map((id) => ({
				vendorId: VENDOR_ID,
				productId: id,
				usage: 0x01,
				usagePage: 0xff0a,
			})),
		})
		.then(async (browserDevices) => {
			return Promise.all(browserDevices.map(async (dev) => openDevice(dev)))
		})
}

/**
 * Reopen previously selected XencelabsQuickKeys.
 * The browser remembers what the user previously allowed your site to access, and this will open those without the request dialog
 */
export async function getXencelabsQuickKeys(): Promise<XencelabsQuickKeysWeb[]> {
	// TODO - error handling
	return navigator.hid.getDevices().then(async (browserDevices) => {
		return Promise.all(browserDevices.map(async (dev) => openDevice(dev)))
	})
}

/**
 * Open a device from a manually selected HIDDevice handle
 * @param browserDevice The unopened browser HIDDevice
 */
export async function openDevice(browserDevice: HIDDevice): Promise<XencelabsQuickKeysWeb> {
	await browserDevice.open()

	const device = await XencelabsQuickKeysDevice.create(new WebHIDDevice(browserDevice))
	return new XencelabsQuickKeysWeb(device)
}
