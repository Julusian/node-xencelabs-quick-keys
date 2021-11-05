import * as EventEmitter from 'eventemitter3'
import { KeyIndex } from './id'

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

	// /**
	//  * Fills the given key with a solid color.
	//  *
	//  * @param {number} keyIndex The key to fill
	//  * @param {number} r The color's red value. 0 - 255
	//  * @param {number} g The color's green value. 0 - 255
	//  * @param {number} b The color's blue value. 0 -255
	//  */
	// fillKeyColor(keyIndex: KeyIndex, r: number, g: number, b: number): Promise<void>

	// /**
	//  * Fills the given key with an image in a Buffer.
	//  *
	//  * @param {number} keyIndex The key to fill
	//  * @param {Buffer} imageBuffer The image to write
	//  * @param {Object} options Options to control the write
	//  */
	// fillKeyBuffer(keyIndex: KeyIndex, imageBuffer: Buffer, options?: FillImageOptions): Promise<void>

	// /**
	//  * Fills the whole panel with an image in a Buffer.
	//  *
	//  * @param {Buffer} imageBuffer The image to write
	//  * @param {Object} options Options to control the write
	//  */
	// fillPanelBuffer(imageBuffer: Buffer, options?: FillPanelOptions): Promise<void>

	// /**
	//  * Clears the given key.
	//  *
	//  * @param {number} keyIndex The key to clear
	//  */
	// clearKey(keyIndex: KeyIndex): Promise<void>

	// /**
	//  * Clears all keys.
	//  */
	// clearPanel(): Promise<void>

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
