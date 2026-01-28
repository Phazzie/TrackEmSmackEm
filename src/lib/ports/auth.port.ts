import type { AuthSession } from '../../../contracts/auth.contract.js';

export interface AuthToken {
	session: AuthSession;
	token: string;
}

export interface AuthPort {
	createSession(passcode: string): Promise<AuthToken | null>;
	verifyToken(token: string): Promise<AuthSession | null>;
}
