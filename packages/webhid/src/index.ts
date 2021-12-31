import { XencelabsQuickKeysManager } from './manager'

export {
	KeyIndex,
	XencelabsQuickKeys,
	XencelabsQuickKeysDisplayOrientation,
	WheelEvent,
	XencelabsQuickKeysWheelSpeed,
	XencelabsQuickKeysDisplayBrightness,
	VENDOR_ID,
} from '@xencelabs-quick-keys/core'
export { XencelabsQuickKeysWeb } from './wrapper'
export { XencelabsQuickKeysManager } from './manager'

export const XencelabsQuickKeysManagerInstance = new XencelabsQuickKeysManager()
