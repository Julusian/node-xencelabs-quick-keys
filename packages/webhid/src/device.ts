import { HIDDevice as CoreHIDDevice } from '@xencelabs-quick-keys/core'
import { EventEmitter } from 'events'
import Queue from 'p-queue'

/**
 * The wrapped browser HIDDevice.
 * This translates it into the common format expected by @xencelabs-quick-keys/core
 */
export class WebHIDDevice extends EventEmitter implements CoreHIDDevice {
	public dataKeyOffset?: number
	private readonly device: HIDDevice

	private readonly reportQueue = new Queue({ concurrency: 1 })

	constructor(device: HIDDevice) {
		super()

		this.device = device
		// this.device.on('error', error => this.emit('error', error))
		this.device.addEventListener('inputreport', (event) => {
			this.emit('data', event.reportId, Buffer.from(event.data.buffer))
		})
	}

	public async close(): Promise<void> {
		return this.device.close()
	}

	public async sendFeatureReport(data: Buffer): Promise<void> {
		return this.device.sendFeatureReport(data[0], new Uint8Array(data.slice(1)))
	}
	public async getFeatureReport(reportId: number, _reportLength: number): Promise<Buffer> {
		const view = await this.device.receiveFeatureReport(reportId)
		return Buffer.from(view.buffer)
	}
	public async sendReports(buffers: Buffer[]): Promise<void> {
		return this.reportQueue.add(async () => {
			for (const data of buffers) {
				await this.device.sendReport(data[0], new Uint8Array(data.slice(1)))
			}
		})
	}
}
