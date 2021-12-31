import {
	PRODUCT_IDS_WIRED,
	PRODUCT_IDS_WIRELESS,
	VENDOR_ID,
	XencelabsQuickKeys,
	XencelabsQuickKeysManagerBase,
} from '@xencelabs-quick-keys/core'
import { WebHIDDevice } from './device'

export type XencelabsQuickKeysManagerEvents = {
	connect: [device: XencelabsQuickKeys]
	disconnect: [device: XencelabsQuickKeys]
}

export class XencelabsQuickKeysManager extends XencelabsQuickKeysManagerBase<HIDDevice> {
	/**
	 * Request the user to select some devices to open
	 */
	public async requestXencelabsQuickKeys(): Promise<void> {
		// TODO - error handling
		const browserDevices = await navigator.hid.requestDevice({
			filters: [...PRODUCT_IDS_WIRED, ...PRODUCT_IDS_WIRELESS].map((id) => ({
				vendorId: VENDOR_ID,
				productId: id,
				usage: 0x01,
				usagePage: 0xff0a,
			})),
		})

		await Promise.all(browserDevices.map(async (dev) => this.openDevice(dev)))
	}
	/**
	 * Reopen previously selected XencelabsQuickKeys.
	 * The browser remembers what the user previously allowed your site to access, and this will open those without the request dialog
	 */
	public async reopenXencelabsQuickKeys(): Promise<void> {
		// TODO - error handling
		const browserDevices = await navigator.hid.getDevices()
		await Promise.all(browserDevices.map(async (dev) => this.openDevice(dev)))
	}
	/**
	 * Open a device from a manually selected HIDDevice handle
	 * @param browserDevice The unopened browser HIDDevice
	 */
	private async openDevice(browserDevice: HIDDevice): Promise<void> {
		// TODO - is HIDDevice a stable enough id?
		if (!this.isOpen(browserDevice)) {
			// This is a new or unsupported device
			if (PRODUCT_IDS_WIRED.includes(browserDevice.productId)) {
				await browserDevice.open()
				const hid = new WebHIDDevice(browserDevice)
				this.openWiredDevice(browserDevice, hid)
			} else if (PRODUCT_IDS_WIRELESS.includes(browserDevice.productId)) {
				await browserDevice.open()
				const hid = new WebHIDDevice(browserDevice)
				this.openWirelessDevice(browserDevice, hid)
			}
		}
	}
}
