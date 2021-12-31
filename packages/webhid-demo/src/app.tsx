import { XencelabsQuickKeysManagerInstance, XencelabsQuickKeys } from '@xencelabs-quick-keys/webhid'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { DeviceRenderer } from './device'

export interface DeviceManagerProps {}

interface WrappedDevice {
	id: string
	device: XencelabsQuickKeys
}
let nextId = 0

export function DeviceManager({}: DeviceManagerProps) {
	const [devices, setDevices] = React.useState<Array<WrappedDevice>>([])

	const onConnect = React.useCallback(
		(dev: XencelabsQuickKeys) => {
			dev.startData().catch((e) => {
				console.error(`Failed to startData: ${e}`)
			})

			setDevices((old) => [
				...old,
				{
					id: dev.deviceId ?? `${nextId++}`,
					device: dev,
				},
			])
		},
		[setDevices]
	)
	const onDisconnect = React.useCallback(
		(dev: XencelabsQuickKeys) => {
			dev.stopData().catch((e) => {
				console.error(`Failed to stopData: ${e}`)
			})

			setDevices((old) => {
				if (dev.deviceId) {
					return old.filter((d) => d.id === dev.deviceId)
				} else {
					return old.filter((d) => d.device === dev)
				}
			})
		},
		[setDevices]
	)

	React.useEffect(() => {
		XencelabsQuickKeysManagerInstance.on('connect', onConnect)
		XencelabsQuickKeysManagerInstance.on('disconnect', onDisconnect)

		return () => {
			XencelabsQuickKeysManagerInstance.off('connect', onConnect)
			XencelabsQuickKeysManagerInstance.off('disconnect', onDisconnect)
		}
	}, [onConnect, onDisconnect])

	const requestDevice = React.useCallback(() => {
		XencelabsQuickKeysManagerInstance.requestXencelabsQuickKeys().catch((e: any) => {
			console.error('Failed', e)
		})
	}, [])
	const reopenDevices = React.useCallback(() => {
		XencelabsQuickKeysManagerInstance.reopenXencelabsQuickKeys().catch((e: any) => {
			console.error('Failed', e)
		})
	}, [])

	return (
		<div>
			<button onClick={requestDevice}>Select usb device</button>
			<button onClick={reopenDevices}>Reopen paired devices</button>

			<hr />

			{devices.map((entry) => (
				<div key={entry.id}>
					<DeviceRenderer device={entry.device} />
					<hr />
				</div>
			))}

			{devices.length === 0 ? <p>No devices are attached</p> : ''}
		</div>
	)
}

const elm = document.getElementById('container')
ReactDom.render(<DeviceManager />, elm!)
