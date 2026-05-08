type LogOptions = { client?: number; server?: number };

const clientVerbosity = (() => {
  if (typeof process === 'undefined') return 3;
  const raw = process.env?.NEXT_PUBLIC_LOG_VERBOSITY_CLIENT;
  const n = raw ? Number(raw) : 3;
  return Number.isFinite(n) ? n : 3;
})();

const serverVerbosity = (() => {
  if (typeof process === 'undefined') return 3;
  const raw = process.env?.LOG_VERBOSITY_SERVER ?? process.env?.NEXT_PUBLIC_LOG_VERBOSITY_CLIENT;
  const n = raw ? Number(raw) : 3;
  return Number.isFinite(n) ? n : 3;
})();

export default function log(messages: unknown[], options: LogOptions = {}): void {
  const isServer = typeof window === 'undefined';
  const required = isServer ? options.server : options.client;
  if (required === undefined) return;
  const threshold = isServer ? serverVerbosity : clientVerbosity;
  if (required > threshold) return;
  // eslint-disable-next-line no-console
  console.log(...messages);
}
