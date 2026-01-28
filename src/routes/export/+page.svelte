<script lang="ts">
	import { getDefaultMonth } from '$lib/domain/month';

	let month = getDefaultMonth();
</script>

<section class="panel">
	<h2>Export data</h2>
	<p>Download a snapshot of the month for backup or sharing.</p>

	<form class="form-grid" method="get" action="/export/data">
		<label>
			<span>Month</span>
			<input name="month" type="month" bind:value={month} required />
		</label>
		<label>
			<span>Format</span>
			<select name="format">
				<option value="json">JSON</option>
				<option value="csv">CSV</option>
			</select>
		</label>
		<button class="primary" type="submit">Download</button>
	</form>
</section>
