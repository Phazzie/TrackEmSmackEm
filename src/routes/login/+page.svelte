<svelte:head>
	<title>Login · Track Em Smack Em</title>
</svelte:head>

<script lang="ts">
	export let form: { error?: string } | undefined;
</script>

<section class="login-card">
	<h2>Enter passcode</h2>
	<p>Single-user access gate. Keep it private.</p>

	<form method="post" class="login-form">
		<label>
			<span>Passcode</span>
			<input name="passcode" type="password" autocomplete="current-password" required />
		</label>
		{#if form?.error}
			<p class="tag">{form.error}</p>
		{/if}
		<button type="submit">Unlock tracker</button>
	</form>
</section>
