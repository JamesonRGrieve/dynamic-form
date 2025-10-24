export function toDisplayLabel(key: string, locale: string): string {
  const normalized = key.replace(/[_-]+/g, ' ').trim();

  if (typeof (Intl as unknown as { Segmenter?: typeof Intl.Segmenter }).Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(locale || undefined, { granularity: 'word' });
    const segments = Array.from(segmenter.segment(normalized.toLocaleLowerCase(locale || undefined)));
    return segments
      .map((segment) => segment.segment)
      .map((segment) => segment.charAt(0).toLocaleUpperCase(locale || undefined) + segment.slice(1))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return normalized
    .split(' ')
    .map((word) => word.charAt(0).toLocaleUpperCase(locale || undefined) + word.slice(1))
    .join(' ')
    .trim();
}
