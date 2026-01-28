import type { AuthSession } from '../contracts/auth.contract.js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	namespace App {
		interface Locals {
			session: AuthSession | null;
		}
	}
}

export {};
