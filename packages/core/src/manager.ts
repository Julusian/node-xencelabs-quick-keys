import EventEmitter = require('eventemitter3')
import { XencelabsQuickKeysWirelessDongle } from './wireless-device'
import { XencelabsQuickKeys } from './types'
import { HIDDevice } from './hid'
import { XencelabsQuickKeysDevice } from './device'

export type XencelabsQuickKeysManagerEvents = {
	connect: [device: XencelabsQuickKeys]
	disconnect: [device: XencelabsQuickKeys]
	error: [err: Error]
}

export interface DeviceEntry {
	device: XencelabsQuickKeysWirelessDongle | XencelabsQuickKeysDevice
	doClose: (() => void) | undefined
}

export abstract class XencelabsQuickKeysManagerBase<TIdentifier> extends EventEmitter<XencelabsQuickKeysManagerEvents> {
	readonly #devices: Map<TIdentifier, DeviceEntry>

	constructor() {
		super()

		this.#devices = new Map()
	}

	/** Close handles to all devices */
	public async closeAll(): Promise<void> {
		for (const device of this.#devices.values()) {
			device.device.closeHidHandle().catch(() => null)
		}
		this.#devices.clear()
	}

	protected getDevice(identifier: TIdentifier): DeviceEntry | undefined {
		return this.#devices.get(identifier)
	}

	protected openWiredDevice(identifier: TIdentifier, hid: HIDDevice): void {
		const device = new XencelabsQuickKeysDevice(hid, null) // No known way to get ids yet for wired

		const deviceDisconnected = () => {
			this.#devices.delete(identifier)
			this.emit('disconnect', device)
		}

		// If it errors, discard
		hid.on('error', () => {
			deviceDisconnected()
		})

		this.#devices.set(identifier, {
			device,
			doClose: deviceDisconnected,
		})

		device
			.subscribeToEventStreams()
			.then(() => {
				// once ready, forward errors to consumers
				hid.on('error', (err) => {
					device.emit('error', err)
				})

				this.emit('connect', device)
			})
			.catch(() => {
				// Ignore error and pretend device was not found

				// close device and ignore any error
				hid.close().catch(() => null)
			})
	}

	protected openWirelessDevice(identifier: TIdentifier, hid: HIDDevice): void {
		const devicesDisconnected = (devs: XencelabsQuickKeys[], closeHid: boolean) => {
			if (closeHid) this.#devices.delete(identifier)
			for (const dev of devs) {
				this.emit('disconnect', dev)
			}
		}
		const deviceConnected = (dev: XencelabsQuickKeys) => {
			this.emit('connect', dev)
		}

		const device = new XencelabsQuickKeysWirelessDongle(hid, devicesDisconnected, deviceConnected)
		this.#devices.set(identifier, {
			device,
			doClose: undefined,
		})
	}
}
