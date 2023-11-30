/* eslint-disable jest/no-standalone-expect */
import { EventEmitter } from 'events'
import type { Device, HIDAsync } from 'node-hid'

export class DummyHID extends EventEmitter implements HIDAsync {
	constructor() {
		super()
	}
	public async close(): Promise<void> {
		throw new Error('Not implemented')
	}
	public async pause(): Promise<void> {
		throw new Error('Not implemented')
	}
	public async read(_timeOut: number): Promise<Buffer | undefined> {
		throw new Error('Not implemented')
	}
	public async resume(): Promise<void> {
		throw new Error('Not implemented')
	}
	// on (event: string, handler: (value: any) => void) {
	// 	throw new Error('Not implemented')
	// }
	public async write(_values: number[]): Promise<number> {
		throw new Error('Not implemented')
	}
	public async setNonBlocking(_no_block: boolean): Promise<void> {
		throw new Error('Method not implemented.')
	}
	public async sendFeatureReport(_data: number[] | Buffer): Promise<number> {
		throw new Error('Method not implemented.')
	}
	public async getFeatureReport(_report_id: number, _report_length: number): Promise<Buffer> {
		throw new Error('Method not implemented.')
	}
	public async getDeviceInfo(): Promise<Device> {
		throw new Error('Method not implemented.')
	}
	public async generateDeviceInfo(): Promise<Device> {
		// HACK: temporary
		throw new Error('Method not implemented.')
	}
}
