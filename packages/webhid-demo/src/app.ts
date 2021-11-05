import {
	requestXencelabsQuickKeys,
	XencelabsQuickKeysWeb,
	XencelabsQuickKeysDisplayOrientation,
	XencelabsQuickKeysDisplayBrightness,
	WheelEvent,
	XencelabsQuickKeysWheelSpeed,
} from '@xencelabs-quick-keys/webhid'

function appendLog(str: string) {
	const logElm = document.getElementById('log')
	if (logElm) {
		logElm.textContent = `${str}\n${logElm.textContent}`
	}
}

const consentButton = document.getElementById('consent-button')

let device: XencelabsQuickKeysWeb | null = null

async function updateLabels(): Promise<void> {
	if (device) {
		const ps: Array<Promise<void>> = []
		document.querySelectorAll<HTMLInputElement>('.textlabel').forEach((input) => {
			const id = input.getAttribute('data-id')
			if (id && device) {
				const id2 = parseInt(id)

				ps.push(device.setKeyText(id2, input.value.substr(0, 8)))
			}
		})

		await Promise.all(ps)
	}
}

async function updateColour(): Promise<void> {
	if (device) {
		const red = parseInt(document.querySelector<HTMLInputElement>('#red-range')?.value ?? '0')
		const green = parseInt(document.querySelector<HTMLInputElement>('#green-range')?.value ?? '0')
		const blue = parseInt(document.querySelector<HTMLInputElement>('#blue-range')?.value ?? '0')

		await device.setWheelColor(red, green, blue)
	}
}

let wheelCount = 0
const wheelCounter = document.querySelector('#counter')

async function openDevice(device: XencelabsQuickKeysWeb): Promise<void> {
	appendLog(`Device opened`) //. Firmware: ${await device.getFirmwareVersion()}`)

	device.on('down', (key: number) => {
		appendLog(`Key ${key} down`)
		document.querySelector(`[data-id="${key}"]`)?.classList?.add('pressed')
	})
	device.on('up', (key: number) => {
		appendLog(`Key ${key} up`)
		document.querySelector(`[data-id="${key}"]`)?.classList?.remove('pressed')
	})
	device.on('wheel', (e: WheelEvent) => {
		appendLog(`Wheel ${e} `)
		switch (e) {
			case WheelEvent.Left:
				wheelCount--
				break
			case WheelEvent.Right:
				wheelCount++
				break
		}
		if (wheelCounter) wheelCounter.innerHTML = `${wheelCount}`
	})

	wheelCount = 0
	if (wheelCounter) wheelCounter.innerHTML = `${wheelCount}`

	document.querySelectorAll<HTMLInputElement>('.textlabel').forEach((e) => e.classList.remove('pressed'))

	await device.setSleepTimeout(5)
	await device.setWheelSpeed(XencelabsQuickKeysWheelSpeed.Normal)
	await device.setDisplayOrientation(XencelabsQuickKeysDisplayOrientation.Rotate0)
	await device.setDisplayBrightness(XencelabsQuickKeysDisplayBrightness.Full)

	await updateColour()
	await updateLabels()
}

if (consentButton) {
	// window.addEventListener('load', async () => {
	// 	// attempt to open a previously selected device.
	// 	const devices = await getXencelabsQuickKeys()
	// 	if (devices.length > 0) {
	// 		device = devices[0]
	// 		openDevice(device).catch(console.error)
	// 	}
	// 	console.log(devices)
	// })

	document.getElementById('red-range')?.addEventListener('input', updateColour)
	document.getElementById('green-range')?.addEventListener('input', updateColour)
	document.getElementById('blue-range')?.addEventListener('input', updateColour)

	const speedRange = document.getElementById('speed-range') as HTMLInputElement | undefined
	if (speedRange) {
		speedRange.addEventListener('input', () => {
			const speed = parseInt(speedRange.value) as any as XencelabsQuickKeysWheelSpeed
			if (device) {
				device.setWheelSpeed(6 - speed).catch(console.error) // flip the number
			}
		})
	}

	document.querySelectorAll<HTMLInputElement>('.textlabel').forEach((e) => e.addEventListener('input', updateLabels))

	const brightnessSelect = document.getElementById('brightness-select') as HTMLInputElement | undefined
	if (brightnessSelect) {
		brightnessSelect.addEventListener('input', () => {
			const value = parseInt(brightnessSelect.value) as any as XencelabsQuickKeysDisplayBrightness
			if (device) {
				device.setDisplayBrightness(value).catch(console.error)
			}
		})
	}

	const orientationSelect = document.getElementById('orientation-select') as HTMLInputElement | undefined
	if (orientationSelect) {
		orientationSelect.addEventListener('input', () => {
			const value = parseInt(orientationSelect.value) as any as XencelabsQuickKeysDisplayOrientation
			if (device) {
				device.setDisplayOrientation(value).catch(console.error)
			}
		})
	}

	document.getElementById('overlay-show')?.addEventListener('click', () => {
		const durationElm = document.getElementById('overlay-duration') as HTMLInputElement | undefined
		const textElm = document.getElementById('overlay-text') as HTMLInputElement | undefined
		if (device && durationElm && textElm) {
			device.showOverlayText(parseInt(durationElm.value), textElm.value).catch(console.error)
		}
	})

	consentButton.addEventListener('click', async () => {
		if (device) {
			appendLog('Closing device')
			// currentDemo.stop(device).catch(console.error)
			await device.close()
			device = null
		}
		// Prompt for a device
		try {
			const devices = await requestXencelabsQuickKeys()
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
