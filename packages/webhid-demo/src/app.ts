import { requestXenceQuickKeys, getXenceQuickKeys, XenceQuickKeysWeb } from '@xencelabs-quick-keys/webhid'

function appendLog(str: string) {
	const logElm = document.getElementById('log')
	if (logElm) {
		logElm.textContent = `${str}\n${logElm.textContent}`
	}
}

const consentButton = document.getElementById('consent-button')

let device: XenceQuickKeysWeb | null = null
// let currentDemo: Demo = new FillWhenPressedDemo()
// async function demoChange() {
// 	if (demoSelect) {
// 		console.log(`Selected demo: ${demoSelect.value}`)
// 		if (device) {
// 			await currentDemo.stop(device)
// 		}

// 		switch (demoSelect.value) {
// 			case 'rapid-fill':
// 				currentDemo = new RapidFillDemo()
// 				break
// 			case 'dom':
// 				currentDemo = new DomImageDemo()
// 				break
// 			case 'chase':
// 				currentDemo = new ChaseDemo()
// 				break
// 			case 'fill-when-pressed':
// 			default:
// 				currentDemo = new FillWhenPressedDemo()
// 				break
// 		}

// 		if (device) {
// 			await currentDemo.start(device)
// 		}
// 	}
// }

async function openDevice(device: XenceQuickKeysWeb): Promise<void> {
	// appendLog(`Device opened. Serial: ${await device.getSerialNumber()} Firmware: ${await device.getFirmwareVersion()}`)

	device.on('down', (key: number) => {
		appendLog(`Key ${key} down`)
		// currentDemo.keyDown(device, key).catch(console.error)
	})
	device.on('up', (key: number) => {
		appendLog(`Key ${key} up`)
		// currentDemo.keyUp(device, key).catch(console.error)
	})

	// await currentDemo.start(device)

	// Sample actions
	// await device.setBrightness(70)

	// device.fillColor(2, 255, 0, 0)
	// device.fillColor(12, 0, 0, 255)
}

if (consentButton) {
	window.addEventListener('load', async () => {
		// attempt to open a previously selected device.
		const devices = await getXenceQuickKeys()
		if (devices.length > 0) {
			device = devices[0]
			openDevice(device).catch(console.error)
		}
		console.log(devices)
	})

	const brightnessRange = document.getElementById('brightness-range') as HTMLInputElement | undefined
	if (brightnessRange) {
		brightnessRange.addEventListener('input', (_e) => {
			// const value = brightnessRange.value as any as number
			// if (device) {
			// 	device.setBrightness(value).catch(console.error)
			// }
		})
	}

	consentButton.addEventListener('click', async () => {
		if (device) {
			appendLog('Closing device')
			// currentDemo.stop(device).catch(console.error)
			await device.close()
			device = null
		}
		// Prompt for a device
		try {
			const devices = await requestXenceQuickKeys()
			device = devices[0]
			if (devices.length === 0) {
				appendLog('No device was selected')
				return
			}
		} catch (error) {
			appendLog(`No device access granted: ${error}`)
			return
		}

		openDevice(device).catch(console.error)
	})

	appendLog('Page loaded')
}
