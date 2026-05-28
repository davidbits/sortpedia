import { describe, expect, it } from 'vitest';
import { hasEmbedMode, isVisualizerEmbedUrl } from './embed';

describe('embed mode URL parsing', () => {
	it('enables embed mode for visualizer embed URLs', () => {
		expect(isVisualizerEmbedUrl(new URL('https://sortpedia.com/visualizer?embed=1'))).toBe(true);
		expect(
			isVisualizerEmbedUrl(new URL('https://sortpedia.com/visualizer?embed=1&algo=quick-sort'))
		).toBe(true);
	});

	it('does not enable embed mode for other values or routes', () => {
		expect(isVisualizerEmbedUrl(new URL('https://sortpedia.com/visualizer?embed=true'))).toBe(
			false
		);
		expect(isVisualizerEmbedUrl(new URL('https://sortpedia.com/visualizer'))).toBe(false);
		expect(isVisualizerEmbedUrl(new URL('https://sortpedia.com/library?embed=1'))).toBe(false);
	});

	it('parses the embed parameter independently of routes', () => {
		expect(hasEmbedMode(new URLSearchParams('embed=1'))).toBe(true);
		expect(hasEmbedMode(new URLSearchParams('embed=true'))).toBe(false);
	});
});
