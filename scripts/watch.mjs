// eslint-disable-next-line node/no-unpublished-import
import concurrently from 'concurrently'

let devServerFlags = ''
if ('DEVSERVER_FLAGS' in process.env) {
	devServerFlags = process.env.DEVSERVER_FLAGS
}

;(async () => {
	try {
		console.log('Starting watchers')
		// Now run everything
		await concurrently(
			[
				{
					command: 'yarn workspace @xencelabs-quick-keys/core build:main --watch',
					prefixColor: 'bgBlue.bold',
					name: 'CORE',
				},
				{
					command: 'yarn workspace @xencelabs-quick-keys/node build:main --watch',
					prefixColor: 'bgGreen.bold',
					name: 'NODE',
				},
				{
					command: 'yarn workspace @xencelabs-quick-keys/webhid build:main --watch',
					prefixColor: 'bgPink.bold',
					name: 'WEB',
				},
				{
					command: 'yarn workspace @xencelabs-quick-keys/webhid-demo start ' + devServerFlags,
					prefixColor: 'bgRed.bold',
					name: 'DEMO',
				},
			],
			{
				prefix: 'name',
				killOthers: ['failure', 'success'],
				restartTries: 3,
			}
		).result

		console.log('Done!')
		process.exit()
	} catch (err) {
		console.error(`Failure: ${err}`)
		process.exit(1)
	}
})()
