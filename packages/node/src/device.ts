import { HIDDevice } from '@xencelabs-quick-keys/core'
import { EventEmitter } from 'events'
import * as HID from 'node-hid'

/**
 * The wrapped node-hid HIDDevice.
 * This translates it into the common format expected by @xencelabs-quick-keys/core
 */
export class NodeHIDDevice extends EventEmitter implements HIDDevice {
	private device: HID.HIDAsync

	constructor(device: HID.HIDAsync) {
		super()

		this.device = device
		this.device.on('error', (error) => this.emit('error', error))

		// TODO - delay this until it is needed, to avoid the overhead..
		this.device.on('data', (data: Buffer) => {
			this.emit('data', data.readUInt8(0), data.slice(1))
		})
	}

	public async close(): Promise<void> {
		console.log('close', (this.device as any).path)
		await this.device.close()
	}

	public async sendReports(buffers: Buffer[]): Promise<void> {
		await Promise.all(buffers.map(async (data) => this.device.write(data)))
	}
}
