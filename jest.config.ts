import { JestConfigWithTsJest } from 'ts-jest'

const config: JestConfigWithTsJest = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['./build/'],
	setupFilesAfterEnv: ['./src/setup-jest.ts'],
	detectOpenHandles: true,
	onlyChanged: true,
}

export default config
