import { XenceQuickKeys, XenceQuickKeysProxy } from '@xencelabs-quick-keys/core'

export class XenceQuickKeysNode extends XenceQuickKeysProxy {
	constructor(device: XenceQuickKeys) {
		super(device)
	}
}
