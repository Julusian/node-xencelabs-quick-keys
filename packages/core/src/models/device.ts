import * as EventEmitter from 'eventemitter3'

import { HIDDevice } from '../device'
import { KeyIndex } from './id'
import { XenceQuickKeys, XenceQuickKeysEvents } from './types'

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

		this.device.on('error', (err) => {
			this.emit('error', err)
		})
	}

	public checkValidKeyIndex(keyIndex: KeyIndex): void {
		if (keyIndex < 0 || keyIndex >= keyCount) {
			throw new TypeError(`Expected a valid keyIndex 0 - ${keyCount - 1}`)
		}
	}

	public close(): Promise<void> {
		return this.device.close()
	}

	public async setKeyText(keyIndex: KeyIndex, text: string): Promise<void> {
		this.checkValidKeyIndex(keyIndex)

		if (typeof text !== 'string' || text.length > 8)
			throw new TypeError(`Expected a valid label of up to 8 characters`)

		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(0x02, 0)
		buffer.writeUInt8(0xb1, 1)
		buffer.writeUInt8(keyIndex, 3)
		buffer.writeUInt8(text.length * 2, 5)
		// 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, @10 ??
		buffer.write(text, 16, 'utf16le')

		return this.device.sendReports([buffer])
	}
}
