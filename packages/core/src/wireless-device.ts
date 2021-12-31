import EventEmitter = require('eventemitter3')
import { XencelabsQuickKeysDevice } from './device'
import { HIDDevice } from './hid'
import { XencelabsQuickKeys } from './types'

export class WirelessSubHIDDevice extends EventEmitter implements HIDDevice {
	readonly #parent: HIDDevice
	readonly #deviceId: string

	constructor(parent: HIDDevice, deviceId: string) {
		super()

		this.#parent = parent
		this.#deviceId = deviceId
	}

	async close(): Promise<void> {
		// Should never be used
	}
	async sendReports(buffers: Buffer[]): Promise<void> {
		for (const buffer of buffers) {
			buffer.write(this.#deviceId, 10, 6, 'hex')
		}
		return this.#parent.sendReports(buffers)
	}
}

export class XencelabsQuickKeysWirelessDongle {
	readonly #device: HIDDevice
	readonly #devicesDisconnected: (devices: XencelabsQuickKeys[], closeHid: boolean) => void
	readonly #deviceConnected: (device: XencelabsQuickKeys) => void

	readonly #children: Map<string, { wrapper: XencelabsQuickKeysDevice; hid: WirelessSubHIDDevice }>

	constructor(
		device: HIDDevice,
		devicesDisconnected: (devices: XencelabsQuickKeys[], closeHid: boolean) => void,
		deviceConnected: (device: XencelabsQuickKeys) => void
	) {
		this.#device = device
		this.#devicesDisconnected = devicesDisconnected
		this.#deviceConnected = deviceConnected

		this.#children = new Map()

		const closeAll = () => {
			const devs = Array.from(this.#children.values()).map((c) => c.wrapper)
			this.#devicesDisconnected(devs, true)
		}

		{
			// check if there is a surface already connected to the dongle
			const discoverBuffer = Buffer.alloc(32)
			discoverBuffer.writeUInt8(0x02, 0)
			discoverBuffer.writeUInt8(0xb8, 1)
			discoverBuffer.writeUInt8(0x01, 2)
			this.#device.sendReports([discoverBuffer]).catch(() => {
				// Ignore error and pretend device was not found

				// close device and ignore any error
				this.#device.close().catch(() => null)
				closeAll()
			})
		}

		this.#device.on('error', () => {
			// Device errored, we assume that means gone away
			// TODO something with the error?
			closeAll()
		})

		this.#device.on('data', (reportId, data) => {
			// Device uses only one reportId
			if (reportId !== 0x02) return

			// Report is device status
			if (data.readUInt8(0) === 0xf8) {
				const deviceId = data.toString('hex', 9, 15)

				// TODO - should discovery be cut off at some point?
				let child = this.#children.get(deviceId)
				let isNew = false
				if (!child) {
					const hid = new WirelessSubHIDDevice(this.#device, deviceId)
					const wrapper = new XencelabsQuickKeysDevice(hid, deviceId)
					child = { wrapper, hid }
					this.#children.set(deviceId, child)
					isNew = true
				}

				const device = child.wrapper
				const newState = data.readUInt8(1)
				if (newState === 3) {
					// already connected
					if (isNew) {
						// subscribe to events
						device
							.subscribeToEventStreams()
							.then(() => {
								this.#deviceConnected(device)
							})
							.catch(() => {
								// Ignore error and pretend device was not found

								// close device and ignore any error
								this.#device.close().catch(() => null)
								closeAll()
							})
					} else {
						// already known
					}
				} else if (newState === 4) {
					// lost connection
					this.#devicesDisconnected([device], false)
				} else if (newState === 2) {
					// just connected
					this.#deviceConnected(device)

					// subscribe to events
					device
						.subscribeToEventStreams()
						.then(() => {
							this.#deviceConnected(device)
						})
						.catch(() => {
							// Ignore error and pretend device was not found

							// close device and ignore any error
							this.#device.close().catch(() => null)
							closeAll()
						})
				} else {
					// Unknown status. are there more?
				}
			} else {
				// TODO - is this a constant offset or does it vary?
				const deviceId = data.toString('hex', 11, 17)
				const child = this.#children.get(deviceId)
				// console.log('pkt', deviceId, child, data)
				if (child) {
					// Forward to the correct child
					child.hid.emit('data', reportId, data)
				} else {
					// No device found, this might be a bug?
				}
			}
		})
	}

	/** Close the raw HID handle. Not for public use */
	public async closeHidHandle(): Promise<void> {
		await this.#device.close()
	}
}
