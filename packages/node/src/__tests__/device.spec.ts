// tslint:disable-next-line: no-submodule-imports
import { mocked } from 'ts-jest/utils'

import { DummyHID } from '../__mocks__/hid'

jest.mock('node-hid')
import { devices, HID } from 'node-hid'
// Forcing path to be string, as there are multiple constructor options, we require the string one
mocked(HID).mockImplementation((path: any) => new DummyHID(path))

// Must be required after we register a mock for `node-hid`.
import { DEVICE_INTERFACE, getXenceQuickKeysInfo, listXenceQuickKeys, openXenceQuickKeys } from '../'
import { PRODUCT_IDS, VENDOR_ID } from '@xencelabs-quick-keys/core'

describe('Xence Quick Keys', () => {
	function mockDevicesImplementation() {
		mocked(devices).mockImplementation(() => [
			...PRODUCT_IDS.map((id) => ({
				productId: id,
				vendorId: VENDOR_ID,
				interface: DEVICE_INTERFACE,
				path: `path-${id}`,
				serialNumber: `some-number-${id}`,
				release: 0,
			})),
			{
				productId: PRODUCT_IDS[0],
				vendorId: VENDOR_ID + 1,
				interface: DEVICE_INTERFACE,
				path: 'path-bad-vendor',
				release: 0,
			},
			{
				productId: PRODUCT_IDS[0] + 1000,
				vendorId: VENDOR_ID,
				interface: DEVICE_INTERFACE,
				path: 'path-bad-product',
				release: 0,
			},
			{
				productId: PRODUCT_IDS[0],
				vendorId: VENDOR_ID,
				interface: DEVICE_INTERFACE + 1,
				path: 'path-wrong-interface',
				release: 0,
			},
		])
	}

	test('no devices', () => {
		mocked(devices).mockImplementation(() => [])

		expect(listXenceQuickKeys()).toEqual([])
	})
	test('some devices', () => {
		mockDevicesImplementation()

		expect(listXenceQuickKeys()).toEqual([
			{
				path: 'path-20994',
				// serialNumber: 'some-number',
			},
			{
				path: 'path-20995',
				// serialNumber: 'some-number-again',
			},
		])
	})
	test('info for bad path', () => {
		mockDevicesImplementation()

		const info = getXenceQuickKeysInfo('not-a-real-path')
		expect(info).toBeFalsy()

		const info2 = getXenceQuickKeysInfo('path-bad-product')
		expect(info2).toBeFalsy()
	})
	test('info for good path', () => {
		mockDevicesImplementation()

		const info2 = getXenceQuickKeysInfo('path-20994')
		expect(info2).toEqual({
			path: 'path-20994',
			// serialNumber: 'some-number-again',
		})
	})
	test('create for bad path', async () => {
		mockDevicesImplementation()

		await expect(async () => openXenceQuickKeys('not-a-real-path')).rejects.toThrowError(
			new Error(`Device "not-a-real-path" was not found`)
		)

		await expect(async () => openXenceQuickKeys('path-bad-product')).rejects.toThrowError(
			new Error(`Device "path-bad-product" was not found`)
		)
	})
})
