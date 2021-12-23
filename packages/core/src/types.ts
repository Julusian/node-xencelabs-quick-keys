import * as EventEmitter from 'eventemitter3'

export type KeyIndex = number

export enum WheelEvent {
	Left = 'left',
	Right = 'right',
}

export type XencelabsQuickKeysEvents = {
	down: [key: KeyIndex]
	up: [key: KeyIndex]
	wheel: [event: WheelEvent]
	error: [err: unknown]
	battery: [percent: number]
}

export enum XencelabsQuickKeysDisplayOrientation {
	Rotate0 = 1,
	Rotate90 = 2,
	Rotate180 = 3,
	Rotate270 = 4,
}

export enum XencelabsQuickKeysDisplayBrightness {
	Off = 0,
	Low = 1,
	Medium = 2,
	Full = 3,
}

export enum XencelabsQuickKeysWheelSpeed {
	Slowest = 5,
	Slower = 4,
	Normal = 3,
	Faster = 2,
	Fastest = 1,
}

export interface XencelabsQuickKeys extends EventEmitter<XencelabsQuickKeysEvents> {
	/** Unique identifier for the device, when known */
	readonly deviceId: string | null

	/**
	 * Checks if a keyIndex is valid. Throws an error on failure
	 * @param keyIndex The key to check
	 */
	checkValidKeyIndex(keyIndex: KeyIndex): void

	/**
	 * Start listening to device data
	 */
	startData(): Promise<void>

	/**
	 * Stop listening to device data
	 */
	stopData(): Promise<void>

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
	setDisplayOrientation(orientation: XencelabsQuickKeysDisplayOrientation): Promise<void>

	/**
	 * Set the display brightness
	 *
	 * @param {number} brightness The brightness of the display 0-3
	 */
	setDisplayBrightness(brightness: XencelabsQuickKeysDisplayBrightness): Promise<void>

	/**
	 * Set the speed of the wheel
	 *
	 * @param {number} speed The speed of the wheel 5-1
	 */
	setWheelSpeed(speed: XencelabsQuickKeysWheelSpeed): Promise<void>

	/**
	 * Set the sleep timeout. The device will go into a sleep mode after this period.
	 * In minutes
	 *
	 * @param {number} minutes The timeout in minutes
	 */
	setSleepTimeout(minutes: number): Promise<void>

	/**
	 * Show a line of text over the whole display, for a period of time
	 *
	 * @param {number} duration How long to show for (seconds)
	 * @param {string} text The text to display. Up to 32 characters
	 */
	showOverlayText(duration: number, text: string): Promise<void>

	// /**
	//  * Get firmware version from device
	//  */
	// getFirmwareVersion(): Promise<string>
}
