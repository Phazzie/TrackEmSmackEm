import { z } from 'zod';

export const PasscodeInputSchema = z.object({
	passcode: z.string().min(4)
});

export const AuthSessionSchema = z.object({
	userId: z.string().min(1),
	issuedAt: z.string().datetime(),
	expiresAt: z.string().datetime()
});

export type PasscodeInput = z.infer<typeof PasscodeInputSchema>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;
