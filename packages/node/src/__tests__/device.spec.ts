/* eslint-disable jest/no-commented-out-tests */

import { DummyHID } from '../__mocks__/hid'
import { DEVICE_INTERFACE } from '../manager'

jest.mock('node-hid')
import { devices, HID } from 'node-hid'
// Forcing path to be string, as there are multiple constructor options, we require the string one
jest.mocked(HID).mockImplementation((path: any) => new DummyHID(path))

// Must be required after we register a mock for `node-hid`.
import { PRODUCT_IDS_WIRED, PRODUCT_IDS_WIRELESS, VENDOR_ID } from '@xencelabs-quick-keys/core'

describe('Xence Quick Keys', () => {
	function mockDevicesImplementation() {
		jest.mocked(devices).mockImplementation(() => [
			...[...PRODUCT_IDS_WIRED, ...PRODUCT_IDS_WIRELESS].map((id) => ({
				productId: id,
				vendorId: VENDOR_ID,
				interface: DEVICE_INTERFACE,
				path: `path-${id}`,
				serialNumber: `some-number-${id}`,
				release: 0,
			})),
			{
				productId: PRODUCT_IDS_WIRED[0],
				vendorId: VENDOR_ID + 1,
				interface: DEVICE_INTERFACE,
				path: 'path-bad-vendor',
				release: 0,
			},
			{
				productId: PRODUCT_IDS_WIRED[0] + 1000,
				vendorId: VENDOR_ID,
				interface: DEVICE_INTERFACE,
				path: 'path-bad-product',
				release: 0,
			},
			{
				productId: PRODUCT_IDS_WIRED[0],
				vendorId: VENDOR_ID,
				interface: DEVICE_INTERFACE + 1,
				path: 'path-wrong-interface',
				release: 0,
			},
		])
	}

	test('dummy', () => {
		mockDevicesImplementation()

		// TODO - something real
		expect(true).toBeTruthy()
	})

	// test('no devices', () => {
	// 	mocked(devices).mockImplementation(() => [])

	// 	expect(listXencelabsQuickKeys()).toEqual([])
	// })
	// test('some devices', () => {
	// 	mockDevicesImplementation()

	// 	expect(listXencelabsQuickKeys()).toEqual([
	// 		{
	// 			path: 'path-20994',
	// 			// serialNumber: 'some-number',
	// 		},
	// 		{
	// 			path: 'path-20995',
	// 			// serialNumber: 'some-number-again',
	// 		},
	// 	])
	// })
	// test('info for bad path', () => {
	// 	mockDevicesImplementation()

	// 	const info = getXencelabsQuickKeysInfo('not-a-real-path')
	// 	expect(info).toBeFalsy()

	// 	const info2 = getXencelabsQuickKeysInfo('path-bad-product')
	// 	expect(info2).toBeFalsy()
	// })
	// test('info for good path', () => {
	// 	mockDevicesImplementation()

	// 	const info2 = getXencelabsQuickKeysInfo('path-20994')
	// 	expect(info2).toEqual({
	// 		path: 'path-20994',
	// 		// serialNumber: 'some-number-again',
	// 	})
	// })
	// test('create for bad path', async () => {
	// 	mockDevicesImplementation()

	// 	await expect(async () => openXencelabsQuickKeys('not-a-real-path')).rejects.toThrowError(
	// 		new Error(`Device "not-a-real-path" was not found`)
	// 	)

	// 	await expect(async () => openXencelabsQuickKeys('path-bad-product')).rejects.toThrowError(
	// 		new Error(`Device "path-bad-product" was not found`)
	// 	)
	// })
})
