import { redirect } from '@sveltejs/kit';
import { AUTH_COOKIE_NAME, getAuthAdapter, isAuthEnabled } from '$lib/server/auth';

const PUBLIC_PATHS = ['/login', '/_app', '/icon', '/manifest', '/favicon'];

export async function handle({ event, resolve }) {
	if (!isAuthEnabled()) {
		return resolve(event);
	}

	const token = event.cookies.get(AUTH_COOKIE_NAME);
	const adapter = getAuthAdapter();
	const session = token ? await adapter.verifyToken(token) : null;
	const isPublic = PUBLIC_PATHS.some((path) => event.url.pathname.startsWith(path));

	event.locals.session = session;

	if (!session && !isPublic) {
		throw redirect(303, '/login');
	}

	if (session && isPublic) {
		throw redirect(303, '/people');
	}

	return resolve(event);
}
