import { HIDDevice } from '@xencelabs-quick-keys/core'
import { EventEmitter } from 'events'
import * as HID from 'node-hid'

/**
 * Information about a found device
 */
export interface XenceQuickKeysInfo {
	/** The connected path of the device in the usb tree */
	path: string
	// /** The serialNumber of the device. If set it can be used as a unique hardware identifier */
	// serialNumber?: string
}

/**
 * The wrapped node-hid HIDDevice.
 * This translates it into the common format expected by @xencelabs-quick-keys/core
 */
export class NodeHIDDevice extends EventEmitter implements HIDDevice {
	public dataKeyOffset?: number
	private device: HID.HID

	constructor(deviceInfo: XenceQuickKeysInfo) {
		super()

		this.device = new HID.HID(deviceInfo.path)
		this.device.on('error', (error) => this.emit('error', error))

		this.device.on('data', (data: Buffer) => {
			this.emit('data', data.readUInt8(0), data.slice(1))
		})
	}

	public async close(): Promise<void> {
		this.device.close()
	}

	public async sendFeatureReport(data: Buffer): Promise<void> {
		this.device.sendFeatureReport(data)
	}
	public async getFeatureReport(reportId: number, reportLength: number): Promise<Buffer> {
		return Buffer.from(this.device.getFeatureReport(reportId, reportLength))
	}
	public async sendReports(buffers: Buffer[]): Promise<void> {
		for (const data of buffers) {
			this.device.write(data)
		}
	}
}
