import { describe, it, expect } from 'vitest';
import { PasscodeAuthAdapter } from '../../src/lib/adapters/auth.passcode.js';

describe('passcode auth adapter', () => {
	it('creates and verifies sessions', async () => {
		expect.assertions(2);
		const adapter = new PasscodeAuthAdapter({
			passcode: 'open-sesame',
			secret: 'test-secret',
			ttlDays: 1
		});

		const token = await adapter.createSession('open-sesame');
		expect(token?.token).toBeDefined();

		const session = await adapter.verifyToken(token?.token ?? '');
		expect(session?.userId).toBe('owner');
	});

	it('rejects bad passcodes', async () => {
		expect.assertions(1);
		const adapter = new PasscodeAuthAdapter({
			passcode: 'open-sesame',
			secret: 'test-secret',
			ttlDays: 1
		});

		const token = await adapter.createSession('nope');
		expect(token).toBeNull();
	});
});
