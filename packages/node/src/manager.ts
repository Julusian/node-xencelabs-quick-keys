import {
	PRODUCT_IDS_WIRED,
	PRODUCT_IDS_WIRELESS,
	VENDOR_ID,
	XencelabsQuickKeysManagerBase,
} from '@xencelabs-quick-keys/core'
import * as HID from 'node-hid'
import { NodeHIDDevice } from './device'

const DEVICE_INTERFACE = 2

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

async function tryOpenDevice(path: string): Promise<NodeHIDDevice> {
	try {
		return new NodeHIDDevice({ path })
	} catch (_e) {
		// failed, sleep then try again

		await sleep(50)

		try {
			return new NodeHIDDevice({ path })
		} catch (_e2) {
			// Failed again, sleep a bit more

			await sleep(500)

			// Try one final time
			return new NodeHIDDevice({ path })
		}
	}
}
export class XencelabsQuickKeysManager extends XencelabsQuickKeysManagerBase<string> {
	/** Newly discovered devices will be announced via the connect event, as they are not always immediately accessible */
	public async scanDevices(): Promise<void> {
		const devices = HID.devices()

		// TODO - this needs to wait for other scans to have finished

		for (const dev of devices) {
			if (dev.vendorId === VENDOR_ID && dev.path && dev.interface === DEVICE_INTERFACE) {
				const path = dev.path
				if (!this.isOpen(dev.path)) {
					// This is a new or unsupported device
					if (PRODUCT_IDS_WIRED.includes(dev.productId)) {
						tryOpenDevice(path)
							.then((hid) => {
								this.openWiredDevice(path, hid)
							})
							.catch((e) => this.emit('error', e))
					} else if (PRODUCT_IDS_WIRELESS.includes(dev.productId)) {
						tryOpenDevice(path)
							.then((hid) => {
								this.openWirelessDevice(path, hid)
							})
							.catch((e) => this.emit('error', e))
					}
				}
			}
		}
	}
}
