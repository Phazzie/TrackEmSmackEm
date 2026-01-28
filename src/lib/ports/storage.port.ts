import type {
	Assignment,
	Code,
	CreateCodeInput,
	CreatePersonInput,
	Month,
	MonthSnapshot,
	Person,
	SetAssignmentInput
} from '../../../contracts/storage.contract.js';

export interface StoragePort {
	getMonthSnapshot(month: Month): Promise<MonthSnapshot>;
	listPeople(): Promise<Person[]>;
	createPerson(input: CreatePersonInput): Promise<Person>;
	listCodes(month: Month): Promise<Code[]>;
	createCode(input: CreateCodeInput): Promise<Code>;
	setAssignment(input: SetAssignmentInput): Promise<Assignment>;
	listAssignments(month: Month): Promise<Assignment[]>;
}
