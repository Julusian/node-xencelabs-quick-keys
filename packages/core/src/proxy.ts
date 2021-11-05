import * as EventEmitter from 'eventemitter3'
import {
	KeyIndex,
	XenceQuickKeys,
	XenceQuickKeysDisplayBrightness,
	XenceQuickKeysEvents,
	XenceQuickKeysOrientation,
	XenceQuickKeysWheelSpeed,
} from './types'

/**
 * A minimal proxy around a XenceQuickKeys instance.
 * This is intended to be used by libraries wrapping this that want to add more methods to the XenceQuickKeys class
 */

export class XenceQuickKeysProxy implements XenceQuickKeys {
	protected device: XenceQuickKeys

	constructor(device: XenceQuickKeys) {
		this.device = device
	}

	public checkValidKeyIndex(keyIndex: KeyIndex): void {
		this.device.checkValidKeyIndex(keyIndex)
	}

	public async close(): Promise<void> {
		return this.device.close()
	}

	public async setKeyText(keyIndex: KeyIndex, text: string): Promise<void> {
		return this.device.setKeyText(keyIndex, text)
	}

	public async setWheelColor(r: number, g: number, b: number): Promise<void> {
		return this.device.setWheelColor(r, g, b)
	}

	public async setTextOrientation(orientation: XenceQuickKeysOrientation): Promise<void> {
		return this.device.setTextOrientation(orientation)
	}

	public async setDisplayBrightness(brightness: XenceQuickKeysDisplayBrightness): Promise<void> {
		return this.device.setDisplayBrightness(brightness)
	}

	public async setWheelSpeed(speed: XenceQuickKeysWheelSpeed): Promise<void> {
		return this.device.setWheelSpeed(speed)
	}

	public async setSleepTimeout(minutes: number): Promise<void> {
		return this.device.setSleepTimeout(minutes)
	}

	public async showOverlayText(duration: number, text: string): Promise<void> {
		return this.device.showOverlayText(duration, text)
	}

	// public getFirmwareVersion(): Promise<string> {
	// 	return this.device.getFirmwareVersion()
	// }

	/**
	 * EventEmitter
	 */

	public eventNames(): Array<EventEmitter.EventNames<XenceQuickKeysEvents>> {
		return this.device.eventNames()
	}

	public listeners<T extends EventEmitter.EventNames<XenceQuickKeysEvents>>(
		event: T
	): Array<EventEmitter.EventListener<XenceQuickKeysEvents, T>> {
		return this.device.listeners(event)
	}

	public listenerCount(event: EventEmitter.EventNames<XenceQuickKeysEvents>): number {
		return this.device.listenerCount(event)
	}

	public emit<T extends EventEmitter.EventNames<XenceQuickKeysEvents>>(
		event: T,
		...args: EventEmitter.EventArgs<XenceQuickKeysEvents, T>
	): boolean {
		return this.device.emit(event, ...args)
	}

	/**
	 * Add a listener for a given event.
	 */
	public on<T extends EventEmitter.EventNames<XenceQuickKeysEvents>>(
		event: T,
		fn: EventEmitter.EventListener<XenceQuickKeysEvents, T>,
		context?: unknown
	): this {
		this.device.on(event, fn, context)
		return this
	}
	public addListener<T extends EventEmitter.EventNames<XenceQuickKeysEvents>>(
		event: T,
		fn: EventEmitter.EventListener<XenceQuickKeysEvents, T>,
		context?: unknown
	): this {
		this.device.addListener(event, fn, context)
		return this
	}

	/**
	 * Add a one-time listener for a given event.
	 */
	public once<T extends EventEmitter.EventNames<XenceQuickKeysEvents>>(
		event: T,
		fn: EventEmitter.EventListener<XenceQuickKeysEvents, T>,
		context?: unknown
	): this {
		this.device.once(event, fn, context)
		return this
	}

	/**
	 * Remove the listeners of a given event.
	 */
	public removeListener<T extends EventEmitter.EventNames<XenceQuickKeysEvents>>(
		event: T,
		fn?: EventEmitter.EventListener<XenceQuickKeysEvents, T>,
		context?: unknown,
		once?: boolean
	): this {
		this.device.removeListener(event, fn, context, once)
		return this
	}
	public off<T extends EventEmitter.EventNames<XenceQuickKeysEvents>>(
		event: T,
		fn?: EventEmitter.EventListener<XenceQuickKeysEvents, T>,
		context?: unknown,
		once?: boolean
	): this {
		this.device.off(event, fn, context, once)
		return this
	}

	public removeAllListeners(event?: EventEmitter.EventNames<XenceQuickKeysEvents>): this {
		this.device.removeAllListeners(event)
		return this
	}
}
