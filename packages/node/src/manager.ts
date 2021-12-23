import {
	PRODUCT_IDS_WIRED,
	PRODUCT_IDS_WIRELESS,
	VENDOR_ID,
	XencelabsQuickKeys,
	XencelabsQuickKeysManagerBase,
} from '@xencelabs-quick-keys/core'
import * as HID from 'node-hid'
import { NodeHIDDevice } from './device'

export type XencelabsQuickKeysManagerEvents = {
	connect: [device: XencelabsQuickKeys]
	disconnect: [device: XencelabsQuickKeys]
}

const DEVICE_INTERFACE = 2

export abstract class XencelabsQuickKeysManager extends XencelabsQuickKeysManagerBase<string> {
	/** Newly discovered devices will be announced via the connect event, as they are not always immediately accessible */
	public async scanDevices(): Promise<void> {
		const devices = HID.devices()

		// TODO - this needs to wait for other scans to have finished

		// TODO - detect device disconnection

		for (const dev of devices) {
			if (dev.vendorId === VENDOR_ID && dev.path && dev.interface === DEVICE_INTERFACE) {
				if (!this.isOpen(dev.path)) {
					// This is a new or unsupported device
					if (PRODUCT_IDS_WIRED.includes(dev.productId)) {
						const hid = new NodeHIDDevice({ path: dev.path })
						this.openWiredDevice(dev.path, hid)
					} else if (PRODUCT_IDS_WIRELESS.includes(dev.productId)) {
						const hid = new NodeHIDDevice({ path: dev.path })
						this.openWirelessDevice(dev.path, hid)
					}
				}
			}
		}
	}
}
