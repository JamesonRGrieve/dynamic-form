type LogOptions = { client?: number; server?: number };

function parseVerbosity(raw: string | undefined): number {
  if (raw === undefined || raw === '') {
    return 3;
  }
  const n = Number(raw);
  return Number.isFinite(n) ? n : 3;
}

const clientVerbosity = (() => {
  if (typeof process === 'undefined') {
    return 3;
  }
  return parseVerbosity(process.env['NEXT_PUBLIC_LOG_VERBOSITY_CLIENT']);
})();

const serverVerbosity = (() => {
  if (typeof process === 'undefined') {
    return 3;
  }
  return parseVerbosity(process.env['LOG_VERBOSITY_SERVER'] ?? process.env['NEXT_PUBLIC_LOG_VERBOSITY_CLIENT']);
})();

export default function log(messages: unknown[], options: LogOptions = {}): void {
  const isServer = typeof window === 'undefined';
  const required = isServer ? options.server : options.client;
  if (required === undefined) {
    return;
  }
  const threshold = isServer ? serverVerbosity : clientVerbosity;
  if (required > threshold) {
    return;
  }

  // eslint-disable-next-line no-console -- intentional logger output gated by verbosity
  console.log(...messages);
}
