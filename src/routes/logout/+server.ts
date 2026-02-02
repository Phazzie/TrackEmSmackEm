import { redirect } from '@sveltejs/kit';
import { AUTH_COOKIE_NAME } from '$lib/server/auth';

export const POST = async ({ cookies }) => {
	cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
	throw redirect(303, '/login');
};
