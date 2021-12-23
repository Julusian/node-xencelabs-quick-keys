import { HIDDevice as CoreHIDDevice } from '@xencelabs-quick-keys/core'
import { EventEmitter } from 'events'
import Queue from 'p-queue'

/**
 * The wrapped browser HIDDevice.
 * This translates it into the common format expected by @xencelabs-quick-keys/core
 */
export class WebHIDDevice extends EventEmitter implements CoreHIDDevice {
	private readonly device: HIDDevice

	private readonly reportQueue = new Queue({ concurrency: 1 })

	constructor(device: HIDDevice) {
		super()

		// console.log(device.collections)

		this.device = device
		// this.device.on('error', error => this.emit('error', error))
		this.device.addEventListener('inputreport', (event) => {
			this.emit('data', event.reportId, Buffer.from(event.data.buffer))
		})
	}

	public async close(): Promise<void> {
		return this.device.close()
	}

	public async sendReports(buffers: Buffer[]): Promise<void> {
		await this.reportQueue.add(async () => {
			for (const data of buffers) {
				await this.device.sendReport(data[0], new Uint8Array(data.slice(1)))
			}
		})
	}
}
