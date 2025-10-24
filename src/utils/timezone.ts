import timezones from 'timezones-list';

export interface TimezoneOption {
  tzCode: string;
  label: string;
  utc: string;
}

export function getSortedTimezones(): TimezoneOption[] {
  return [...timezones].sort((a, b) => {
    if (a.utc !== b.utc) {
      return a.utc.localeCompare(b.utc);
    }
    return a.tzCode.localeCompare(b.tzCode);
  });
}
