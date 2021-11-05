import {
	XenceQuickKeys,
	XenceQuickKeysDevice,
	WheelEvent,
	XenceQuickKeysDisplayBrightness,
	XenceQuickKeysOrientation,
	XenceQuickKeysWheelSpeed,
} from '../'
import { DummyHID } from './hid'

async function openMockDevice(path: string): Promise<XenceQuickKeys> {
	const device = new DummyHID(path)

	// swap the sendReports function, to supress the one that is emitted during connection
	const oldFn = device.sendReports
	const mockedFn = ((device as any).sendReports = jest.fn())

	const result = await XenceQuickKeysDevice.create(device)

	expect(mockedFn).toHaveBeenCalledTimes(1)
	device.sendReports = oldFn
	return result
}

describe('Xencelabs Quick Keys', () => {
	const devicePath = 'some_random_path_here'
	let quickKeys: XenceQuickKeys
	function getDevice(dev?: XenceQuickKeys): DummyHID {
		return (dev || (quickKeys as any)).device
	}

	beforeEach(async () => {
		quickKeys = await openMockDevice(devicePath)
	})

	test('constructor uses the provided devicePath', async () => {
		const mockDevice = await openMockDevice(devicePath)
		const device = getDevice(mockDevice)
		expect(device.path).toEqual(devicePath)
	})

	function emitFakeData(device: DummyHID, buttons1: number, buttons2: number, wheel: number) {
		device.emit('data', 0x02, Buffer.from([0xf0, buttons1, buttons2, 0x01, 0x01, 0x01, wheel]))
	}

	test('wheel events', () => {
		const downSpy = jest.fn()
		const upSpy = jest.fn()
		const wheelSpy = jest.fn()
		quickKeys.on('up', upSpy)
		quickKeys.on('down', downSpy)
		quickKeys.on('wheel', wheelSpy)

		const device = getDevice()
		emitFakeData(device, 0x01, 0x01, 0x01)
		emitFakeData(device, 0x01, 0x01, 0x02)
		emitFakeData(device, 0x01, 0x01, 0x08)

		expect(wheelSpy).toHaveBeenCalledTimes(2)
		expect(downSpy).toHaveBeenCalledTimes(0)
		expect(upSpy).toHaveBeenCalledTimes(0)
		expect(wheelSpy).toHaveBeenNthCalledWith(1, WheelEvent.Right)
		expect(wheelSpy).toHaveBeenNthCalledWith(2, WheelEvent.Left)
	})

	test('down and up events', () => {
		const downSpy = jest.fn()
		const upSpy = jest.fn()
		const wheelSpy = jest.fn()
		quickKeys.on('up', upSpy)
		quickKeys.on('down', downSpy)
		quickKeys.on('wheel', wheelSpy)

		const device = getDevice()
		emitFakeData(device, 0x04, 0x00, 0x00)
		emitFakeData(device, 0x00, 0x00, 0x00)

		expect(downSpy).toHaveBeenCalledTimes(1)
		expect(upSpy).toHaveBeenCalledTimes(1)
		expect(wheelSpy).toHaveBeenCalledTimes(0)
		expect(downSpy).toHaveBeenNthCalledWith(1, 2)
		expect(upSpy).toHaveBeenNthCalledWith(1, 2)
	})

	test('down and up events: combined presses', () => {
		const downSpy = jest.fn()
		const upSpy = jest.fn()
		const wheelSpy = jest.fn()
		quickKeys.on('down', downSpy)
		quickKeys.on('up', upSpy)
		quickKeys.on('wheel', wheelSpy)

		const device = getDevice()
		// Press 1
		emitFakeData(device, 0x02, 0x00, 0x00)
		// Press 9
		emitFakeData(device, 0x02, 0x02, 0x00)

		expect(downSpy).toHaveBeenCalledTimes(2)
		expect(upSpy).toHaveBeenCalledTimes(0)
		expect(wheelSpy).toHaveBeenCalledTimes(0)

		// Release both
		emitFakeData(device, 0x00, 0x00, 0x00)

		expect(downSpy).toHaveBeenCalledTimes(2)
		expect(upSpy).toHaveBeenCalledTimes(2)
		expect(wheelSpy).toHaveBeenCalledTimes(0)
		expect(downSpy).toHaveBeenNthCalledWith(1, 1)
		expect(upSpy).toHaveBeenNthCalledWith(1, 1)
		expect(downSpy).toHaveBeenNthCalledWith(2, 9)
		expect(upSpy).toHaveBeenNthCalledWith(2, 9)
	})

	test('checkValidKeyIndex', async () => {
		await expect(() => quickKeys.setKeyText(-1, 'a')).rejects.toThrow()
		await expect(() => quickKeys.setKeyText(15, 'a')).rejects.toThrow()
	})

	test('setKeyText throws on non string', async () => {
		const msg = 'Expected a valid label of up to 8 characters'

		await expect(() => quickKeys.setKeyText(0, 0 as any)).rejects.toThrow(msg)
		await expect(() => quickKeys.setKeyText(0, null as any)).rejects.toThrow(msg)
		await expect(() => quickKeys.setKeyText(0, Buffer.alloc(4) as any)).rejects.toThrow(msg)
	})

	test('setKeyText', async () => {
		const device = getDevice()
		device.sendReports = jest.fn()

		await quickKeys.setKeyText(0, 'abc')
		await quickKeys.setKeyText(7, 'hello123')

		expect(device.sendReports).toHaveBeenCalledTimes(2)
		expect(device.sendReports).toHaveBeenNthCalledWith(1, [
			Buffer.from([
				0x02, 0xb1, 0x00, 0x01, 0x00, 0x06, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 97,
				0x00, 98, 0x00, 99, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])
		expect(device.sendReports).toHaveBeenNthCalledWith(2, [
			Buffer.from([
				0x02, 0xb1, 0x00, 0x08, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 104,
				0x00, 101, 0x00, 108, 0x00, 108, 0x00, 111, 0x00, 49, 0x00, 50, 0x00, 51, 0x00,
			]),
		])

		await expect(() => quickKeys.setKeyText(0, '012345678')).rejects.toThrow()
		await expect(() => quickKeys.setKeyText(-1, 'abc')).rejects.toThrow()
		await expect(() => quickKeys.setKeyText(8, 'abc')).rejects.toThrow()
	})

	test('forwards error events from the device', () => {
		const errorSpy = jest.fn()
		quickKeys.on('error', errorSpy)

		const device = getDevice()
		device.emit('error', new Error('Test'))

		expect(errorSpy).toHaveBeenCalledTimes(1)
		expect(errorSpy).toHaveBeenNthCalledWith(1, new Error('Test'))
	})

	test('setDisplayBrightness', async () => {
		const device = getDevice()
		device.sendReports = jest.fn()

		await quickKeys.setDisplayBrightness(XenceQuickKeysDisplayBrightness.Full)
		await quickKeys.setDisplayBrightness(XenceQuickKeysDisplayBrightness.Off)

		expect(device.sendReports).toHaveBeenCalledTimes(2)
		expect(device.sendReports).toHaveBeenNthCalledWith(1, [
			Buffer.from([
				0x02, 0xb1, 0x0a, 0x01, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])
		expect(device.sendReports).toHaveBeenNthCalledWith(2, [
			Buffer.from([
				0x02, 0xb1, 0x0a, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])

		await expect(() => quickKeys.setDisplayBrightness(XenceQuickKeysDisplayBrightness.Full + 1)).rejects.toThrow()
		await expect(() => quickKeys.setDisplayBrightness(-1)).rejects.toThrow()
	})

	test('setWheelSpeed', async () => {
		const device = getDevice()
		device.sendReports = jest.fn()

		await quickKeys.setWheelSpeed(XenceQuickKeysWheelSpeed.Fastest)
		await quickKeys.setWheelSpeed(XenceQuickKeysWheelSpeed.Slowest)

		expect(device.sendReports).toHaveBeenCalledTimes(2)
		expect(device.sendReports).toHaveBeenNthCalledWith(1, [
			Buffer.from([
				0x02, 0xb4, 0x04, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])
		expect(device.sendReports).toHaveBeenNthCalledWith(2, [
			Buffer.from([
				0x02, 0xb4, 0x04, 0x01, 0x01, 0x05, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])

		await expect(() => quickKeys.setWheelSpeed(XenceQuickKeysWheelSpeed.Fastest - 1)).rejects.toThrow()
		await expect(() => quickKeys.setWheelSpeed(XenceQuickKeysWheelSpeed.Slowest + 1)).rejects.toThrow()
	})

	test('setTextOrientation', async () => {
		const device = getDevice()
		device.sendReports = jest.fn()

		await quickKeys.setTextOrientation(XenceQuickKeysOrientation.Rotate0)
		await quickKeys.setTextOrientation(XenceQuickKeysOrientation.Rotate270)

		expect(device.sendReports).toHaveBeenCalledTimes(2)
		expect(device.sendReports).toHaveBeenNthCalledWith(1, [
			Buffer.from([
				0x02, 0xb1, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])
		expect(device.sendReports).toHaveBeenNthCalledWith(2, [
			Buffer.from([
				0x02, 0xb1, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])

		await expect(() => quickKeys.setTextOrientation(XenceQuickKeysOrientation.Rotate270 + 1)).rejects.toThrow()
		await expect(() => quickKeys.setTextOrientation(0)).rejects.toThrow()
	})

	test('setSleepTimeout', async () => {
		const device = getDevice()
		device.sendReports = jest.fn()

		await quickKeys.setSleepTimeout(5)
		await quickKeys.setSleepTimeout(200)

		expect(device.sendReports).toHaveBeenCalledTimes(2)
		expect(device.sendReports).toHaveBeenNthCalledWith(1, [
			Buffer.from([
				0x02, 0xb4, 0x08, 0x01, 5, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])
		expect(device.sendReports).toHaveBeenNthCalledWith(2, [
			Buffer.from([
				0x02, 0xb4, 0x08, 0x01, 200, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])

		await expect(() => quickKeys.setSleepTimeout(256)).rejects.toThrow()
		await expect(() => quickKeys.setSleepTimeout(-1)).rejects.toThrow()
	})

	test('setWheelColor', async () => {
		const device = getDevice()
		device.sendReports = jest.fn()

		await quickKeys.setWheelColor(0, 0, 200)
		await quickKeys.setWheelColor(255, 1, 20)

		expect(device.sendReports).toHaveBeenCalledTimes(2)
		expect(device.sendReports).toHaveBeenNthCalledWith(1, [
			Buffer.from([
				0x02, 0xb4, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 200, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])
		expect(device.sendReports).toHaveBeenNthCalledWith(2, [
			Buffer.from([
				0x02, 0xb4, 0x01, 0x01, 0x00, 0x00, 255, 1, 20, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])

		await expect(() => quickKeys.setWheelColor(0, 0, -1)).rejects.toThrow()
		await expect(() => quickKeys.setWheelColor(0, 0, 256)).rejects.toThrow()
	})

	test('showOverlayText', async () => {
		const device = getDevice()
		device.sendReports = jest.fn()

		await quickKeys.showOverlayText(200, 'abc')
		await quickKeys.showOverlayText(7, '01234567890123456789012345678901')

		expect(device.sendReports).toHaveBeenCalledTimes(2)
		expect(device.sendReports).toHaveBeenNthCalledWith(1, [
			Buffer.from([
				0x02, 0xb1, 0x05, 200, 0x00, 0x06, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 97, 0x00,
				98, 0x00, 99, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
			Buffer.from([
				0x02, 0xb1, 0x06, 200, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 0x00,
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			]),
		])
		expect(device.sendReports).toHaveBeenNthCalledWith(2, [
			Buffer.from([
				0x02, 0xb1, 0x05, 7, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 48, 0x00,
				49, 0x00, 50, 0x00, 51, 0x00, 52, 0x00, 53, 0x00, 54, 0x00, 55, 0x00,
			]),
			Buffer.from([
				0x02, 0xb1, 0x06, 7, 0x00, 0x10, 0x01, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 56, 0x00,
				57, 0x00, 48, 0x00, 49, 0x00, 50, 0x00, 51, 0x00, 52, 0x00, 53, 0x00,
			]),
			Buffer.from([
				0x02, 0xb1, 0x06, 7, 0x00, 0x10, 0x01, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 54, 0x00,
				55, 0x00, 56, 0x00, 57, 0x00, 48, 0x00, 49, 0x00, 50, 0x00, 51, 0x00,
			]),
			Buffer.from([
				0x02, 0xb1, 0x06, 7, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0xeb, 0x4f, 0x49, 0xbd, 0xd7, 0xfa, 52, 0x00,
				53, 0x00, 54, 0x00, 55, 0x00, 56, 0x00, 57, 0x00, 48, 0x00, 49, 0x00,
			]),
		])

		await expect(() => quickKeys.showOverlayText(1, '012345678901234567890123456789012')).rejects.toThrow()
		await expect(() => quickKeys.showOverlayText(0, 'abc')).rejects.toThrow()
		await expect(() => quickKeys.showOverlayText(256, 'abc')).rejects.toThrow()
	})

	// 		test('firmwareVersion', async () => {
	// 			const device = getDevice()
	// 			device.getFeatureReport = async (): Promise<Buffer> => {
	// 				return Buffer.from([4, 85, 170, 212, 4, 49, 46, 48, 46, 49, 55, 48, 49, 51, 51, 0, 0])
	// 			}

	// 			const firmware = await quickKeys.getFirmwareVersion()
	// 			expect(firmware).toEqual('1.0.170133')
	// 		})

	// 		test('serialNumber', async () => {
	// 			const device = getDevice()
	// 			device.getFeatureReport = async (): Promise<Buffer> => {
	// 				return Buffer.from([3, 85, 170, 211, 3, 65, 76, 51, 55, 71, 49, 65, 48, 50, 56, 52, 48])
	// 			}

	// 			const firmware = await quickKeys.getSerialNumber()
	// 			expect(firmware).toEqual('AL37G1A02840')
	// 		})

	test('close', async () => {
		const device = getDevice()
		device.close = jest.fn()

		await quickKeys.close()

		expect(device.close).toHaveBeenCalledTimes(1)
	})
})
