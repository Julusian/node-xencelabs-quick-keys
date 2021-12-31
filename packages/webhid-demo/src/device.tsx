import * as React from 'react'
import {
	XencelabsQuickKeys,
	WheelEvent,
	XencelabsQuickKeysDisplayBrightness,
	XencelabsQuickKeysDisplayOrientation,
	XencelabsQuickKeysWheelSpeed,
} from '@xencelabs-quick-keys/webhid'
import classNames from 'classnames'
import { ChromePicker, ColorResult } from 'react-color'

export interface DeviceRendererProps {
	device: XencelabsQuickKeys
}

const VALID_WHEEL_SPEEDS = Object.values(XencelabsQuickKeysWheelSpeed).filter(
	(w) => typeof w === 'number'
) as XencelabsQuickKeysWheelSpeed[]

export function DeviceRenderer({ device }: DeviceRendererProps) {
	const [pressed, setPressed] = React.useState(new Array<boolean>(10).fill(false))
	const [battery, setBattery] = React.useState<number | null>(null)
	const [wheelCount, setWheelCount] = React.useState(0)
	const [wheelColour, setWheelColour] = React.useState({ r: 255, g: 0, b: 0 })
	const [brightness, setBrightness] = React.useState(XencelabsQuickKeysDisplayBrightness.Full)
	const [orientation, setOrientation] = React.useState(XencelabsQuickKeysDisplayOrientation.Rotate0)
	const [wheelSpeed, setWheelSpeed] = React.useState(XencelabsQuickKeysWheelSpeed.Normal)

	const onKeyDown = React.useCallback(
		(key: number) => {
			console.log('down', key)
			setPressed((old) => {
				const res = [...old]
				res[key] = true
				return res
			})
		},
		[setPressed]
	)
	const onKeyUp = React.useCallback(
		(key: number) => {
			console.log('up', key)
			setPressed((old) => {
				const res = [...old]
				res[key] = false
				return res
			})
		},
		[setPressed]
	)
	const onWheel = React.useCallback(
		(e: WheelEvent) => {
			// appendLog(`Wheel ${e} `)
			switch (e) {
				case WheelEvent.Left:
					setWheelCount((old) => old - 1)
					break
				case WheelEvent.Right:
					setWheelCount((old) => old + 1)
					break
			}
		},
		[setWheelCount]
	)
	const onBattery = React.useCallback(
		(percent: number) => {
			setBattery(percent)
		},
		[setBattery]
	)

	React.useEffect(() => {
		device.on('down', onKeyDown)
		device.on('up', onKeyUp)
		device.on('wheel', onWheel)
		device.on('battery', onBattery)

		return () => {
			device.off('down', onKeyDown)
			device.off('up', onKeyUp)
			device.off('wheel', onWheel)
			device.off('battery', onBattery)
		}
	}, [device, onKeyDown, onKeyUp, onWheel])

	const setKeyText = React.useCallback(
		(key: number, text: string) => {
			device.setKeyText(key, text).catch((e) => {
				console.error('Failed to setKeyText', e)
			})
		},
		[device]
	)
	const changeWheelColour = React.useCallback(
		(color: ColorResult) => {
			setWheelColour(color.rgb)

			device.setWheelColor(color.rgb.r, color.rgb.g, color.rgb.b).catch((e) => {
				console.error('Failed to setWheelColor', e)
			})
		},
		[device, setWheelColour]
	)
	const changeDisplayBrightness = React.useCallback(
		(e: any) => {
			const val = Number(e.target.value) as XencelabsQuickKeysDisplayBrightness
			setBrightness(val)

			device.setDisplayBrightness(val).catch((e) => {
				console.error('Failed to setDisplayBrightness', e)
			})
		},
		[device, setBrightness]
	)
	const changeDisplayOrientation = React.useCallback(
		(e: any) => {
			const val = Number(e.target.value) as XencelabsQuickKeysDisplayOrientation
			setOrientation(val)

			device.setDisplayOrientation(val).catch((e) => {
				console.error('Failed to setDisplayOrientation', e)
			})
		},
		[device, setOrientation]
	)
	const changeWheelSpeed = React.useCallback(
		(e: any) => {
			const val = VALID_WHEEL_SPEEDS[Number(e.target.value)]
			setWheelSpeed(val)

			device.setWheelSpeed(val).catch((e) => {
				console.error('Failed to setWheelSpeed', e)
			})
		},
		[device, setOrientation]
	)

	const showOverlay = React.useCallback(
		(duration: number, text: string) => {
			device.showOverlayText(duration, text).catch((e) => {
				console.error('Failed to showOverlayText', e)
			})
		},
		[device]
	)

	// Mount effect
	React.useEffect(() => {
		Promise.resolve()
			.then(async () => {
				await device.setSleepTimeout(5)

				await device.setWheelColor(wheelColour.r, wheelColour.g, wheelColour.b)
				await device.setWheelSpeed(wheelSpeed)
				await device.setDisplayBrightness(brightness)
				await device.setDisplayOrientation(orientation)
			})
			.catch((e) => {
				console.error('Failed to setup', e)
			})
	})

	return (
		<div>
			<p>Id: {device.deviceId ?? '-'}</p>
			<p>Battery: {battery}%</p>

			<table>
				<tbody>
					<tr>
						<td colSpan={5}>Note: these are orientation for 0&#176;</td>
					</tr>
					<tr>
						<td rowSpan={2}>
							<div className={classNames({ btn: true, pressed: pressed[8] })}></div>
						</td>

						<BasicButtonCell index={0} pressed={pressed[0]} defaultText="one" setKeyText={setKeyText} />
						<BasicButtonCell index={1} pressed={pressed[1]} defaultText="two" setKeyText={setKeyText} />
						<BasicButtonCell index={2} pressed={pressed[2]} defaultText="three" setKeyText={setKeyText} />
						<BasicButtonCell index={3} pressed={pressed[3]} defaultText="four" setKeyText={setKeyText} />

						<td rowSpan={2}>
							<div className={classNames({ btn: true, pressed: pressed[9] })} id="counter">
								{wheelCount}
							</div>
						</td>
					</tr>
					<tr>
						<BasicButtonCell index={4} pressed={pressed[4]} defaultText="five" setKeyText={setKeyText} />
						<BasicButtonCell index={5} pressed={pressed[5]} defaultText="six" setKeyText={setKeyText} />
						<BasicButtonCell index={6} pressed={pressed[6]} defaultText="seven" setKeyText={setKeyText} />
						<BasicButtonCell index={7} pressed={pressed[7]} defaultText="eight" setKeyText={setKeyText} />
					</tr>
				</tbody>
			</table>

			<table>
				<tbody>
					<tr>
						<td>
							<p>
								Display Brightness:
								<select onChange={changeDisplayBrightness} value={brightness}>
									<option value={XencelabsQuickKeysDisplayBrightness.Full}>Full</option>
									<option value={XencelabsQuickKeysDisplayBrightness.Medium}>Medium</option>
									<option value={XencelabsQuickKeysDisplayBrightness.Low}>Low</option>
									<option value={XencelabsQuickKeysDisplayBrightness.Off}>Off</option>
								</select>
							</p>

							<p>
								Orientation:
								<select onChange={changeDisplayOrientation} value={orientation}>
									<option value={XencelabsQuickKeysDisplayOrientation.Rotate0}>0&#176;</option>
									<option value={XencelabsQuickKeysDisplayOrientation.Rotate90}>90&#176;</option>
									<option value={XencelabsQuickKeysDisplayOrientation.Rotate180}>180&#176;</option>
									<option value={XencelabsQuickKeysDisplayOrientation.Rotate270}>270&#176;</option>
								</select>
							</p>

							<p>
								Wheel Speed:{' '}
								<input
									type="range"
									min={0}
									max={VALID_WHEEL_SPEEDS.length - 1}
									value={VALID_WHEEL_SPEEDS.indexOf(wheelSpeed)}
									onChange={changeWheelSpeed}
								/>
							</p>

							<ShowOverlay show={showOverlay} />
						</td>
						<td>
							<p>Wheel colour:</p>
							<ChromePicker disableAlpha={true} onChange={changeWheelColour} color={wheelColour} />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

interface BasicButtonCellProps {
	index: number
	pressed: boolean
	defaultText: string
	setKeyText: (key: number, text: string) => void
}

function BasicButtonCell({ index, pressed, defaultText, setKeyText }: BasicButtonCellProps) {
	const [cachedText, setCachedText] = React.useState(defaultText)

	React.useEffect(() => {
		setKeyText(index, cachedText)
	}, [setKeyText, index, cachedText])

	const onChange = React.useCallback(
		(e: any) => {
			setCachedText(e.currentTarget.value)
		},
		[setCachedText]
	)

	return (
		<td>
			<input
				className={classNames({ textlabel: true, pressed: pressed })}
				value={cachedText}
				onChange={onChange}
			/>
		</td>
	)
}

interface ShowOverlayProps {
	show: (duration: number, text: string) => void
}
function ShowOverlay({ show }: ShowOverlayProps) {
	const [duration, setDuration] = React.useState(2)
	const [text, setText] = React.useState('This is an overlay!')

	const changeDuration = React.useCallback(
		(e: any) => {
			setDuration(Number(e.currentTarget.value))
		},
		[setDuration]
	)
	const changeText = React.useCallback(
		(e: any) => {
			setText(e.currentTarget.value)
		},
		[setText]
	)

	const doShow = React.useCallback(() => {
		show(duration, text)
	}, [show, duration, text])

	return (
		<p>
			Overlay:
			<input type="number" min={0} max={255} value={duration} onChange={changeDuration} />
			<input type="text" value={text} maxLength={32} onChange={changeText} />
			<button onClick={doShow}>Show</button>
		</p>
	)
}
