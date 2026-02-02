import { z } from 'zod';

export const MonthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be YYYY-MM');

export const CategorySchema = z.enum([
	'points',
	'wheel_spin',
	'scratch_card',
	'slot_tournament'
]);

export const PersonSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1),
	email: z.string().email(),
	referredBy: z.string().min(1).nullable(),
	referredByFanduel: z.string().min(1).nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime()
});

export const CodeSchema = z.object({
	id: z.string().uuid(),
	month: MonthSchema,
	code: z.string().min(1),
	category: CategorySchema,
	createdAt: z.string().datetime()
});

export const AssignmentSchema = z.object({
	id: z.string().uuid(),
	personId: z.string().uuid(),
	codeId: z.string().uuid(),
	used: z.boolean(),
	resultAmount: z.number().nonnegative().nullable(),
	updatedAt: z.string().datetime()
});

export const MonthSnapshotSchema = z.object({
	month: MonthSchema,
	people: z.array(PersonSchema),
	codes: z.array(CodeSchema),
	assignments: z.array(AssignmentSchema)
});

export const CreatePersonInputSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	referredBy: z.string().min(1).nullable(),
	referredByFanduel: z.string().min(1).nullable(),
});

export const CreateCodeInputSchema = z.object({
	month: MonthSchema,
	code: z.string().min(1),
	category: CategorySchema
});

export const SetAssignmentInputSchema = z.object({
	personId: z.string().uuid(),
	codeId: z.string().uuid(),
	used: z.boolean(),
	resultAmount: z.number().nonnegative().nullable()
});

export type Month = z.infer<typeof MonthSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Code = z.infer<typeof CodeSchema>;
export type Assignment = z.infer<typeof AssignmentSchema>;
export type MonthSnapshot = z.infer<typeof MonthSnapshotSchema>;
export type CreatePersonInput = z.infer<typeof CreatePersonInputSchema>;
export type CreateCodeInput = z.infer<typeof CreateCodeInputSchema>;
export type SetAssignmentInput = z.infer<typeof SetAssignmentInputSchema>;
