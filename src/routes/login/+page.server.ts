import { fail, redirect } from '@sveltejs/kit';
import { PasscodeInputSchema } from '../../../contracts/auth.contract.js';
import { AUTH_COOKIE_NAME, getAuthAdapter } from '$lib/server/auth';

export const actions = {
	default: async ({ request, cookies, url }) => {
		const form = await request.formData();
		const passcode = String(form.get('passcode') ?? '');
		const parsed = PasscodeInputSchema.safeParse({ passcode });

		if (!parsed.success) {
			return fail(400, { error: 'Passcode required.' });
		}

		const adapter = getAuthAdapter();
		const token = await adapter.createSession(parsed.data.passcode);
		if (!token) {
			return fail(401, { error: 'Invalid passcode.' });
		}

		cookies.set(AUTH_COOKIE_NAME, token.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: url.protocol === 'https:'
		});

		throw redirect(303, '/people');
	}
};
