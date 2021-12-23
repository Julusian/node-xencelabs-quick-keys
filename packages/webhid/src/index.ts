import { XencelabsQuickKeysManager } from './manager'

export {
	KeyIndex,
	XencelabsQuickKeys,
	XencelabsQuickKeysDisplayOrientation,
	WheelEvent,
	XencelabsQuickKeysWheelSpeed,
	XencelabsQuickKeysDisplayBrightness,
} from '@xencelabs-quick-keys/core'
export { XencelabsQuickKeysWeb } from './wrapper'
export { XencelabsQuickKeysManager } from './manager'

export const XencelabsQuickKeysDeviceManager = new XencelabsQuickKeysManager()
