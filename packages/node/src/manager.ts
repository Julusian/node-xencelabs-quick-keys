import {
	PRODUCT_IDS_WIRED,
	PRODUCT_IDS_WIRELESS,
	VENDOR_ID,
	XencelabsQuickKeysManagerBase,
} from '@xencelabs-quick-keys/core'
import * as HID from 'node-hid'
import { NodeHIDDevice } from './device'

export const DEVICE_INTERFACE = 2

async function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

async function tryOpenDevice(path: string): Promise<NodeHIDDevice> {
	let hid: HID.HIDAsync | undefined
	try {
		hid = await HID.HIDAsync.open(path)
	} catch (_e) {
		// failed, sleep then try again

		await sleep(50)

		try {
			hid = await HID.HIDAsync.open(path)
		} catch (_e2) {
			// Failed again, sleep a bit more

			await sleep(500)

			// Try one final time
			hid = await HID.HIDAsync.open(path)
		}
	}

	if (hid) {
		return new NodeHIDDevice(hid)
	} else {
		throw new Error('Failed to open device')
	}
}
export class XencelabsQuickKeysManager extends XencelabsQuickKeysManagerBase<string> {
	/**
	 * Perform a scan and open any new devices
	 * Once opened they will be announced via the connect event, as they are not always immediately accessible
	 */
	public async scanDevices(): Promise<void> {
		const devices = await HID.devicesAsync()

		// TODO - this needs to wait for other scans to have finished

		return this.openDevicesFromArray(devices)
	}

	/**
	 * Open any new devices from the list.
	 * Once opened they will be announced via the connect event, as they are not always immediately accessible
	 */
	public async openDevicesFromArray(devices: Array<HID.Device>): Promise<void> {
		for (const dev of devices) {
			if (dev.vendorId === VENDOR_ID && dev.path && dev.interface === DEVICE_INTERFACE) {
				const path = dev.path
				if (!this.getDevice(dev.path)) {
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
