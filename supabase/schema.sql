create extension if not exists pgcrypto;

create table if not exists people (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	email text not null,
	referred_by text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists codes (
	id uuid primary key default gen_random_uuid(),
	month text not null,
	code text not null,
	category text not null,
	created_at timestamptz not null default now(),
	unique (month, code)
);

create table if not exists person_codes (
	id uuid primary key default gen_random_uuid(),
	person_id uuid not null references people(id) on delete cascade,
	code_id uuid not null references codes(id) on delete cascade,
	used boolean not null default false,
	result_amount numeric,
	updated_at timestamptz not null default now(),
	unique (person_id, code_id)
);
