import { XenceQuickKeys, XenceQuickKeysProxy } from '@xencelabs-quick-keys/core'

/**
 * A XenceQuickKeys instance.
 * This is an extended variant of the class, to provide some more web friendly helpers
 */
export class XenceQuickKeysWeb extends XenceQuickKeysProxy {
	constructor(device: XenceQuickKeys) {
		super(device)
	}
}
