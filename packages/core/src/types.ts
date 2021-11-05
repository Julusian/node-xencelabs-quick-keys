import * as EventEmitter from 'eventemitter3'

export type KeyIndex = number

export enum WheelEvent {
	Left = 'left',
	Right = 'right',
}

export type XenceQuickKeysEvents = {
	down: [key: KeyIndex]
	up: [key: KeyIndex]
	wheel: [event: WheelEvent]
	error: [err: unknown]
}

export enum XenceQuickKeysOrientation {
	Rotate0 = 1,
	Rotate90 = 2,
	Rotate180 = 3,
	Rotate270 = 4,
}

export enum XenceQuickKeysDisplayBrightness {
	Off = 0,
	Low = 1,
	Medium = 2,
	Full = 3,
}

export interface XenceQuickKeys extends EventEmitter<XenceQuickKeysEvents> {
	/**
	 * Checks if a keyIndex is valid. Throws an error on failure
	 * @param keyIndex The key to check
	 */
	checkValidKeyIndex(keyIndex: KeyIndex): void

	/**
	 * Close the device
	 */
	close(): Promise<void>

	/**
	 * Set the text for the given key
	 *
	 * @param {number} keyIndex The key to fill
	 * @param {string} text Up to 8 characters of text for the key
	 */
	setKeyText(keyIndex: KeyIndex, text: string): Promise<void>

	/**
	 * Set the wheel ring to a specified color.
	 *
	 * @param {number} r The color's red value. 0 - 255
	 * @param {number} g The color's green value. 0 - 255
	 * @param {number} b The color's blue value. 0 -255
	 */
	setWheelColor(r: number, g: number, b: number): Promise<void>

	/**
	 * Set the orientation of the text labels.
	 *
	 * @param {number} orientation The orientation of the device
	 */
	setTextOrientation(orientation: XenceQuickKeysOrientation): Promise<void>

	/**
	 * Set the display brightness
	 *
	 * @param {number} brightness The brightness of the display 0-3
	 */
	setDisplayBrightness(brightness: XenceQuickKeysDisplayBrightness): Promise<void>

	// /**
	//  * Sets the brightness of the keys on the Stream Deck
	//  *
	//  * @param {number} percentage The percentage brightness
	//  */
	// setBrightness(percentage: number): Promise<void>

	// /**
	//  * Get firmware version from Stream Deck
	//  */
	// getFirmwareVersion(): Promise<string>

	// /**
	//  * Get serial number from Stream Deck
	//  */
	// getSerialNumber(): Promise<string>
}
