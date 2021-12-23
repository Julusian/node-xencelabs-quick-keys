import EventEmitter = require('eventemitter3')
import { XencelabsQuickKeysWirelessDongle } from './wireless-device'
import { XencelabsQuickKeys } from './types'
import { HIDDevice } from './hid'
import { XencelabsQuickKeysDevice } from './device'

export type XencelabsQuickKeysManagerEvents = {
	connect: [device: XencelabsQuickKeys]
	disconnect: [device: XencelabsQuickKeys]
}

export abstract class XencelabsQuickKeysManagerBase<TIdentifier> extends EventEmitter<XencelabsQuickKeysManagerEvents> {
	readonly #devices: Map<TIdentifier, XencelabsQuickKeysWirelessDongle | XencelabsQuickKeysDevice>

	constructor() {
		super()

		this.#devices = new Map()
	}

	/** Close handles to all devices */
	public async closeAll(): Promise<void> {
		for (const _device of this.#devices.values()) {
			// TODO
			// device.close()
		}
		this.#devices.clear()
	}

	protected isOpen(identifier: TIdentifier): boolean {
		return this.#devices.has(identifier)
	}

	protected openWiredDevice(identifier: TIdentifier, hid: HIDDevice): void {
		const deviceDisconnected = (dev: XencelabsQuickKeys) => {
			this.#devices.delete(identifier)
			this.emit('disconnect', dev)
		}

		const device = new XencelabsQuickKeysDevice(hid, null) // No known way to get ids yet for wired

		// If it errors, discard
		hid.on('error', () => {
			deviceDisconnected(device)
		})

		this.#devices.set(identifier, device)

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
		this.#devices.set(identifier, device)
	}
}
