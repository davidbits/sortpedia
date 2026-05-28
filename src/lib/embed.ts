export function hasEmbedMode(searchParams: URLSearchParams) {
	return searchParams.get('embed') === '1';
}

export function isVisualizerEmbedUrl(url: URL) {
	return url.pathname === '/visualizer' && hasEmbedMode(url.searchParams);
}
