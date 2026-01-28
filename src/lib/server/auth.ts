import { env } from '$env/dynamic/private';
import { PasscodeAuthAdapter } from '../adapters/auth.passcode.js';
import type { AuthPort } from '../ports/auth.port.js';

export const AUTH_COOKIE_NAME = 'trackem_session';

function requireEnv(name: string) {
	const value = env[name];
	if (!value) throw new Error(`Missing ${name} environment variable`);
	return value;
}

export function isAuthEnabled() {
	return Boolean(env.APP_PASSCODE && env.APP_SESSION_SECRET);
}

export function getAuthAdapter(): AuthPort {
	const passcode = requireEnv('APP_PASSCODE');
	const secret = requireEnv('APP_SESSION_SECRET');
	const ttlRaw = env.APP_SESSION_TTL_DAYS ?? '30';
	const ttlDays = Number.parseInt(ttlRaw, 10);
	const userId = env.APP_USER_ID ?? 'owner';

	if (!Number.isFinite(ttlDays) || ttlDays <= 0) {
		throw new Error('APP_SESSION_TTL_DAYS must be a positive number');
	}

	return new PasscodeAuthAdapter({ passcode, secret, ttlDays, userId });
}
