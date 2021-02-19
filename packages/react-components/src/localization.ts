export const getLocalTimezone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;
