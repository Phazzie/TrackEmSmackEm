<script lang="ts">
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const totalMap = new Map(data.totals.map((entry) => [entry.id, entry.amount]));
</script>

<section class="panel">
	<div class="panel-header">
		<div>
			<h2>People</h2>
			<p>Track who redeemed what and how much it paid out.</p>
		</div>
		<form class="month-picker" method="get">
			<label>
				<span>Month</span>
				<input name="month" type="month" value={data.month} />
			</label>
			<button type="submit">Load</button>
		</form>
	</div>

	<div class="card-grid">
		{#each data.people as person}
			<a class="card" href={`/people/${person.id}?month=${data.month}`}>
				<div>
					<h3>{person.name}</h3>
					<p class="muted">{person.email}</p>
					{#if person.referredBy}
						<p class="tag">BetRivers: {person.referredBy}</p>
					{/if}
					{#if person.referredByFanduel}
						<p class="tag" style="border-color: #00aff0; color: #00aff0; background: rgba(0, 175, 240, 0.1);">FanDuel: {person.referredByFanduel}</p>
					{/if}
				</div>
				<div class="metric">
					<span>Total</span>
					<strong>${totalMap.get(person.id) ?? 0}</strong>
				</div>
			</a>
		{/each}
	</div>
</section>

<section class="panel">
	<h2>Add person</h2>
	<form method="post" class="form-grid" data-sveltekit-preload-data>
		{#if form?.error}
			<p style="color: var(--accent-strong); grid-column: 1 / -1; font-weight: bold;">{form.error}</p>
		{/if}
		<label>
			<span>Name</span>
			<input name="name" placeholder="Full name" required />
		</label>
		<label>
			<span>Email</span>
			<input name="email" type="email" placeholder="email@example.com" required />
		</label>
		<label>
			<span>BetRivers Referrer</span>
			<input name="referredBy" placeholder="Optional" />
		</label>
		<label>
			<span>FanDuel Referrer</span>
			<input name="referredByFanduel" placeholder="Optional" />
		</label>
		<button class="primary" type="submit" formaction="?/create">Save person</button>
	</form>
</section>
