import { XencelabsQuickKeys, XencelabsQuickKeysProxy } from '@xencelabs-quick-keys/core'

/**
 * A XencelabsQuickKeys instance.
 * This is an extended variant of the class, to provide some more web friendly helpers
 */
export class XencelabsQuickKeysWeb extends XencelabsQuickKeysProxy {
	constructor(device: XencelabsQuickKeys) {
		super(device)
	}
}
