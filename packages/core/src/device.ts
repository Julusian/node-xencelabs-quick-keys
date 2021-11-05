import * as EventEmitter from 'eventemitter3'

import { HIDDevice } from './hid'
import {
	KeyIndex,
	XenceQuickKeys,
	XenceQuickKeysDisplayBrightness,
	XenceQuickKeysEvents,
	XenceQuickKeysOrientation,
} from './types'

const keyCount = 10

export class XenceQuickKeysDevice extends EventEmitter<XenceQuickKeysEvents> implements XenceQuickKeys {
	protected readonly device: HIDDevice
	// private readonly options: Readonly<OpenStreamDeckOptions>
	// private readonly keyState: boolean[]

	constructor(device: HIDDevice) {
		super()

		this.device = device

		// this.keyState = new Array(keyCount).fill(false)

		this.device.on('input', (_data) => {
			// TODO
			// for (let keyIndex = 0; keyIndex < keyCount; keyIndex++) {
			// 	const keyPressed = Boolean(data[keyIndex])
			// 	const stateChanged = keyPressed !== this.keyState[keyIndex]
			// 	if (stateChanged) {
			// 		this.keyState[keyIndex] = keyPressed
			// 		if (keyPressed) {
			// 			this.emit('down', keyIndex)
			// 		} else {
			// 			this.emit('up', keyIndex)
			// 		}
			// 	}
			// }
		})

		this.subscribeToKeyEvents().catch((e) => {
			this.emit('error', e)
		})

		this.device.on('error', (err) => {
			this.emit('error', err)
		})
	}

	private subscribeToKeyEvents(): Promise<void> {
		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb0, 1)
		buffer.writeUInt8(0x04, 2)

		return this.device.sendReports([buffer])
	}

	public checkValidKeyIndex(keyIndex: KeyIndex): void {
		if (keyIndex < 0 || keyIndex >= keyCount) {
			throw new TypeError(`Expected a valid keyIndex 0 - ${keyCount - 1}`)
		}
	}

	public close(): Promise<void> {
		return this.device.close()
	}

	private insertHeader(buffer: Buffer): void {
		buffer.writeUInt8(0xeb, 10)
		buffer.writeUInt8(0x4f, 11)
		buffer.writeUInt8(0x49, 12)
		buffer.writeUInt8(0xbd, 13)
		buffer.writeUInt8(0xd7, 14)
		buffer.writeUInt8(0xfa, 15)
	}

	public async setKeyText(keyIndex: KeyIndex, text: string): Promise<void> {
		this.checkValidKeyIndex(keyIndex)

		if (typeof text !== 'string' || text.length > 8)
			throw new TypeError(`Expected a valid label of up to 8 characters`)

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb1, 1)
		buffer.writeUInt8(keyIndex + 1, 3)
		buffer.writeUInt8(text.length * 2, 5)

		this.insertHeader(buffer)

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

		this.insertHeader(buffer)

		return this.device.sendReports([buffer])
	}

	private checkRGBValue(value: number): void {
		if (value < 0 || value > 255) {
			throw new TypeError('Expected a valid color RGB value 0 - 255')
		}
	}

	public async setTextOrientation(orientation: XenceQuickKeysOrientation): Promise<void> {
		if (!Object.values(XenceQuickKeysOrientation).includes(orientation)) {
			throw new TypeError('Expected a valid orientation')
		}

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb1, 1)
		buffer.writeUInt8(orientation, 2)

		this.insertHeader(buffer)

		return this.device.sendReports([buffer])
	}

	public async setDisplayBrightness(brightness: XenceQuickKeysDisplayBrightness): Promise<void> {
		if (!Object.values(XenceQuickKeysDisplayBrightness).includes(brightness)) {
			throw new TypeError('Expected a valid brightness')
		}

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb1, 1)
		buffer.writeUInt8(0x0a, 2)
		buffer.writeUInt8(0x01, 3)
		buffer.writeUInt8(brightness, 4)

		this.insertHeader(buffer)

		return this.device.sendReports([buffer])
	}
}
