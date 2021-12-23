/* eslint-disable jest/no-standalone-expect */
import { EventEmitter } from 'events'
import { HIDDevice } from '../hid'

export class DummyHID extends EventEmitter implements HIDDevice {
	constructor(public readonly path: string) {
		super()
		expect(typeof path).toEqual('string')
	}

	public async sendReports(_data: Buffer[]): Promise<void> {
		throw new Error('Method not implemented.')
	}
	public async close(): Promise<void> {
		throw new Error('Not implemented')
	}
}
