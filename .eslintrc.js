module.exports = {
	extends: './node_modules/@sofie-automation/code-standard-preset/eslint/main',
	root: true,
	overrides: [
		{
			files: ['*.ts'],
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./packages/*/tsconfig.json'],
			},
			rules: {
				'@typescript-eslint/promise-function-async': ['error'], // TODO - move to preset
			},
		},
		{
			files: ['packages/*/examples/**/*.js', 'packages/*/examples/**/*.ts', '**/__tests__/**/*.ts'],
			rules: {
				'node/no-extraneous-import': 'off',
				'node/no-extraneous-require': 'off',
			},
		},
	],
}
