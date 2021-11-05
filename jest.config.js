module.exports = {
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.json',
			diagnostics: false,
		},
	},
	moduleFileExtensions: ['ts', 'js', 'json'],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
	},
	testMatch: ['**/__tests__/**/*.spec.(ts|js)'],
	testPathIgnorePatterns: ['integrationTests'],
	testEnvironment: 'node',
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	collectCoverageFrom: [
		'**/src/**/*.{ts,js}',
		'!**/src/__tests__/**',
		'!**/node_modules/**',
		'!**/dist/**',
		'!packages/webhid-demo/**',
	],
	collectCoverage: true,
	projects: ['<rootDir>'],
	coverageDirectory: '<rootDir>/coverage/',

	preset: 'ts-jest',

	moduleNameMapper: {
		'@xencelabs-quick-keys/(.+)': '<rootDir>/packages/$1/src',
	},
}
