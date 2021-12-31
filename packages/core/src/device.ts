import * as EventEmitter from 'eventemitter3'
import { WheelEvent } from '.'

import { HIDDevice } from './hid'
import {
	KeyIndex,
	XencelabsQuickKeys,
	XencelabsQuickKeysDisplayBrightness,
	XencelabsQuickKeysEvents,
	XencelabsQuickKeysDisplayOrientation,
	XencelabsQuickKeysWheelSpeed,
} from './types'

const keyCount = 10
const textKeyCount = 8

export class XencelabsQuickKeysDevice extends EventEmitter<XencelabsQuickKeysEvents> implements XencelabsQuickKeys {
	protected readonly device: HIDDevice
	private readonly keyState: boolean[]

	public readonly deviceId: string | null

	public constructor(device: HIDDevice, deviceId: string | null) {
		super()

		this.device = device
		this.deviceId = deviceId

		this.keyState = new Array(keyCount).fill(false)
	}

	/** Close the raw HID handle. Not for public use */
	public async closeHidHandle(): Promise<void> {
		await this.device.close()
	}

	public async startData(): Promise<void> {
		this.device.on('data', this.handleData)
	}

	public async stopData(): Promise<void> {
		this.device.off('data', this.handleData)
	}

	private handleData = (reportId: number, data: Buffer): void => {
		// console.log('MESSAGE', data.toString('hex'))
		if (reportId === 0x02) {
			if (data.readUInt8(0) === 0xf0) {
				const wheelByte = data.readUInt8(6)
				if (wheelByte > 0) {
					if (wheelByte & 0x01) {
						this.emit('wheel', WheelEvent.Right)
					} else if (wheelByte & 0x02) {
						this.emit('wheel', WheelEvent.Left)
					}
				} else {
					const keys = data.readUInt16LE(1)
					for (let keyIndex = 0; keyIndex < keyCount; keyIndex++) {
						const keyPressed = (keys & (1 << keyIndex)) > 0
						const stateChanged = keyPressed !== this.keyState[keyIndex]
						if (stateChanged) {
							this.keyState[keyIndex] = keyPressed
							if (keyPressed) {
								this.emit('down', keyIndex)
							} else {
								this.emit('up', keyIndex)
							}
						}
					}
				}
			} else if (data.readUInt8(0) === 0xf2 && data.readUInt8(1) === 0x01) {
				const percent = data.readUInt8(2)
				this.emit('battery', percent)
			}
		}
	}

	public async subscribeToEventStreams(): Promise<void> {
		// Key events
		const keyBuffer = Buffer.alloc(32)
		keyBuffer.writeUInt8(0x02, 0)
		keyBuffer.writeUInt8(0xb0, 1)
		keyBuffer.writeUInt8(0x04, 2)
		this.insertDeviceId(keyBuffer)

		// battery level
		const batteryBuffer = Buffer.alloc(32)
		batteryBuffer.writeUInt8(0x02, 0)
		batteryBuffer.writeUInt8(0xb4, 1)
		batteryBuffer.writeUInt8(0x10, 2)
		this.insertDeviceId(batteryBuffer)

		return this.device.sendReports([keyBuffer, batteryBuffer])
	}

	public checkValidKeyIndex(keyIndex: KeyIndex): void {
		if (keyIndex < 0 || keyIndex >= keyCount) {
			throw new TypeError(`Expected a valid keyIndex 0 - ${keyCount - 1}`)
		}
	}

	private insertDeviceId(buffer: Buffer): void {
		if (this.deviceId) {
			buffer.write(this.deviceId, 10, 6, 'hex')
		}
	}

	public async setKeyText(keyIndex: KeyIndex, text: string): Promise<void> {
		if (keyIndex < 0 || keyIndex >= textKeyCount) {
			throw new TypeError(`Expected a valid keyIndex 0 - ${textKeyCount - 1}`)
		}

		if (typeof text !== 'string' || text.length > 8)
			throw new TypeError(`Expected a valid label of up to 8 characters`)

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb1, 1)
		buffer.writeUInt8(keyIndex + 1, 3)
		buffer.writeUInt8(text.length * 2, 5)

		this.insertDeviceId(buffer)

		buffer.write(text, 16, 'utf16le')

		return this.device.sendReports([buffer])
	}

	public async setWheelColor(r: number, g: number, b: number): Promise<void> {
		this.checkRGBValue(r)
		this.checkRGBValue(g)
		this.checkRGBValue(b)

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb4, 1)
		buffer.writeUInt8(0x01, 2)
		buffer.writeUInt8(0x01, 3)

		buffer.writeUInt8(r, 6)
		buffer.writeUInt8(g, 7)
		buffer.writeUInt8(b, 8)

		this.insertDeviceId(buffer)

		return this.device.sendReports([buffer])
	}

	private checkRGBValue(value: number): void {
		if (value < 0 || value > 255) {
			throw new TypeError('Expected a valid color RGB value 0 - 255')
		}
	}

	public async setDisplayOrientation(orientation: XencelabsQuickKeysDisplayOrientation): Promise<void> {
		if (!Object.values(XencelabsQuickKeysDisplayOrientation).includes(orientation)) {
			throw new TypeError('Expected a valid orientation')
		}

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb1, 1)
		buffer.writeUInt8(orientation, 2)

		this.insertDeviceId(buffer)

		return this.device.sendReports([buffer])
	}

	public async setDisplayBrightness(brightness: XencelabsQuickKeysDisplayBrightness): Promise<void> {
		if (!Object.values(XencelabsQuickKeysDisplayBrightness).includes(brightness)) {
			throw new TypeError('Expected a valid brightness')
		}

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb1, 1)
		buffer.writeUInt8(0x0a, 2)
		buffer.writeUInt8(0x01, 3)
		buffer.writeUInt8(brightness, 4)

		this.insertDeviceId(buffer)

		return this.device.sendReports([buffer])
	}

	public async setWheelSpeed(speed: XencelabsQuickKeysWheelSpeed): Promise<void> {
		if (!Object.values(XencelabsQuickKeysWheelSpeed).includes(speed)) {
			throw new TypeError('Expected a valid speed')
		}

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb4, 1)
		buffer.writeUInt8(0x04, 2)
		buffer.writeUInt8(0x01, 3)
		buffer.writeUInt8(0x01, 4)
		buffer.writeUInt8(speed, 5)

		this.insertDeviceId(buffer)

		return this.device.sendReports([buffer])
	}

	public async setSleepTimeout(minutes: number): Promise<void> {
		if (minutes < 0 || minutes > 255) {
			throw new TypeError('Expected a valid number of minutes')
		}

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb4, 1)
		buffer.writeUInt8(0x08, 2)
		buffer.writeUInt8(0x01, 3)
		buffer.writeUInt8(minutes, 4)

		this.insertDeviceId(buffer)

		return this.device.sendReports([buffer])
	}

	public async showOverlayText(duration: number, text: string): Promise<void> {
		if (duration <= 0 || duration > 255) throw new TypeError('Expected a valid number of seconds')

		if (typeof text !== 'string' || text.length > 32)
			throw new TypeError(`Expected a valid overlay text of up to 32 characters`)

		const buffers = [
			this.createOverlayChunk(0x05, duration, text.substr(0, 8), false),
			this.createOverlayChunk(0x06, duration, text.substr(8, 8), text.length > 16),
		]

		for (let offset = 16; offset < text.length; offset += 8) {
			buffers.push(this.createOverlayChunk(0x06, duration, text.substr(offset, 8), text.length > offset + 8))
		}

		return this.device.sendReports(buffers)
	}

	private createOverlayChunk(specialByte: number, duration: number, chars: string, hasMore: boolean): Buffer {
		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb1, 1)
		buffer.writeUInt8(specialByte, 2)
		buffer.writeUInt8(duration, 3)
		buffer.writeUInt8(chars.length * 2, 5)
		buffer.writeUInt8(hasMore ? 0x01 : 0x00, 6)

		this.insertDeviceId(buffer)

		buffer.write(chars, 16, 'utf16le')

		return buffer
	}
}
