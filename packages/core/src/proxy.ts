import * as EventEmitter from 'eventemitter3'
import {
	KeyIndex,
	XencelabsQuickKeys,
	XencelabsQuickKeysDisplayBrightness,
	XencelabsQuickKeysEvents,
	XencelabsQuickKeysDisplayOrientation,
	XencelabsQuickKeysWheelSpeed,
} from './types'

/**
 * A minimal proxy around a XencelabsQuickKeys instance.
 * This is intended to be used by libraries wrapping this that want to add more methods to the XencelabsQuickKeys class
 */

export class XencelabsQuickKeysProxy implements XencelabsQuickKeys {
	protected device: XencelabsQuickKeys

	constructor(device: XencelabsQuickKeys) {
		this.device = device
	}

	public get deviceId(): string | null {
		return this.device.deviceId
	}

	public checkValidKeyIndex(keyIndex: KeyIndex): void {
		this.device.checkValidKeyIndex(keyIndex)
	}

	public async startData(): Promise<void> {
		return this.device.startData()
	}
	public async stopData(): Promise<void> {
		return this.device.stopData()
	}

	// public async close(): Promise<void> {
	// 	return this.device.close()
	// }

	public async setKeyText(keyIndex: KeyIndex, text: string): Promise<void> {
		return this.device.setKeyText(keyIndex, text)
	}

	public async setWheelColor(r: number, g: number, b: number): Promise<void> {
		return this.device.setWheelColor(r, g, b)
	}

	public async setDisplayOrientation(orientation: XencelabsQuickKeysDisplayOrientation): Promise<void> {
		return this.device.setDisplayOrientation(orientation)
	}

	public async setDisplayBrightness(brightness: XencelabsQuickKeysDisplayBrightness): Promise<void> {
		return this.device.setDisplayBrightness(brightness)
	}

	public async setWheelSpeed(speed: XencelabsQuickKeysWheelSpeed): Promise<void> {
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

	public eventNames(): Array<EventEmitter.EventNames<XencelabsQuickKeysEvents>> {
		return this.device.eventNames()
	}

	public listeners<T extends EventEmitter.EventNames<XencelabsQuickKeysEvents>>(
		event: T
	): Array<EventEmitter.EventListener<XencelabsQuickKeysEvents, T>> {
		return this.device.listeners(event)
	}

	public listenerCount(event: EventEmitter.EventNames<XencelabsQuickKeysEvents>): number {
		return this.device.listenerCount(event)
	}

	public emit<T extends EventEmitter.EventNames<XencelabsQuickKeysEvents>>(
		event: T,
		...args: EventEmitter.EventArgs<XencelabsQuickKeysEvents, T>
	): boolean {
		return this.device.emit(event, ...args)
	}

	/**
	 * Add a listener for a given event.
	 */
	public on<T extends EventEmitter.EventNames<XencelabsQuickKeysEvents>>(
		event: T,
		fn: EventEmitter.EventListener<XencelabsQuickKeysEvents, T>,
		context?: unknown
	): this {
		this.device.on(event, fn, context)
		return this
	}
	public addListener<T extends EventEmitter.EventNames<XencelabsQuickKeysEvents>>(
		event: T,
		fn: EventEmitter.EventListener<XencelabsQuickKeysEvents, T>,
		context?: unknown
	): this {
		this.device.addListener(event, fn, context)
		return this
	}

	/**
	 * Add a one-time listener for a given event.
	 */
	public once<T extends EventEmitter.EventNames<XencelabsQuickKeysEvents>>(
		event: T,
		fn: EventEmitter.EventListener<XencelabsQuickKeysEvents, T>,
		context?: unknown
	): this {
		this.device.once(event, fn, context)
		return this
	}

	/**
	 * Remove the listeners of a given event.
	 */
	public removeListener<T extends EventEmitter.EventNames<XencelabsQuickKeysEvents>>(
		event: T,
		fn?: EventEmitter.EventListener<XencelabsQuickKeysEvents, T>,
		context?: unknown,
		once?: boolean
	): this {
		this.device.removeListener(event, fn, context, once)
		return this
	}
	public off<T extends EventEmitter.EventNames<XencelabsQuickKeysEvents>>(
		event: T,
		fn?: EventEmitter.EventListener<XencelabsQuickKeysEvents, T>,
		context?: unknown,
		once?: boolean
	): this {
		this.device.off(event, fn, context, once)
		return this
	}

	public removeAllListeners(event?: EventEmitter.EventNames<XencelabsQuickKeysEvents>): this {
		this.device.removeAllListeners(event)
		return this
	}
}
