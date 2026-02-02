<script>
	import '../app.css';
	import { Analytics } from '@vercel/analytics/svelte';
</script>

<svelte:head>
	<title>Track Em Smack Em</title>
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#e06f38" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Serif:wght@400;600&display=swap"
	/>
</svelte:head>

<div class="app-shell">
	<header class="app-header">
		<div class="brand">
			<div class="brand-mark">TS</div>
			<div>
				<h1>Track Em Smack Em</h1>
				<p>Casino bonus code tracking, minus the chaos.</p>
			</div>
		</div>
		<nav class="app-nav">
			<a href="/people">People</a>
			<a href="/codes">Codes</a>
			<a href="/export">Export</a>
			<form action="/logout" method="POST" style="display: contents;">
				<button type="submit" class="link-button">Logout</button>
			</form>
		</nav>
	</header>
	<main class="app-main">
		<slot />
	</main>
</div>

<Analytics />
