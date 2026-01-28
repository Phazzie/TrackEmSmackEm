import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AuthPort, AuthToken } from '../ports/auth.port.js';
import type { AuthSession } from '../../../contracts/auth.contract.js';

function nowIso() {
	return new Date().toISOString();
}

function addDays(iso: string, days: number) {
	const date = new Date(iso);
	date.setUTCDate(date.getUTCDate() + days);
	return date.toISOString();
}

function toBase64(value: string) {
	return Buffer.from(value, 'utf-8').toString('base64url');
}

function fromBase64(value: string) {
	return Buffer.from(value, 'base64url').toString('utf-8');
}

function signPayload(payload: string, secret: string) {
	return createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string) {
	const aBuf = Buffer.from(a);
	const bBuf = Buffer.from(b);
	if (aBuf.length !== bBuf.length) return false;
	return timingSafeEqual(aBuf, bBuf);
}

export class PasscodeAuthAdapter implements AuthPort {
	#passcode: string;
	#secret: string;
	#ttlDays: number;
	#userId: string;

	constructor(config: { passcode: string; secret: string; ttlDays: number; userId?: string }) {
		this.#passcode = config.passcode;
		this.#secret = config.secret;
		this.#ttlDays = config.ttlDays;
		this.#userId = config.userId ?? 'owner';
	}

	async createSession(passcode: string): Promise<AuthToken | null> {
		if (!safeEqual(passcode, this.#passcode)) return null;

		const issuedAt = nowIso();
		const session: AuthSession = {
			userId: this.#userId,
			issuedAt,
			expiresAt: addDays(issuedAt, this.#ttlDays)
		};

		const payload = toBase64(JSON.stringify(session));
		const signature = signPayload(payload, this.#secret);
		return {
			session,
			token: `${payload}.${signature}`
		};
	}

	async verifyToken(token: string): Promise<AuthSession | null> {
		const parts = token.split('.');
		if (parts.length !== 2) return null;
		const [payload, signature] = parts;
		const expected = signPayload(payload, this.#secret);
		if (!safeEqual(signature, expected)) return null;

		const decoded = JSON.parse(fromBase64(payload)) as AuthSession;
		const expires = Date.parse(decoded.expiresAt);
		if (Number.isNaN(expires) || Date.now() > expires) return null;

		return decoded;
	}
}
