export type Flag = 'PERSISTENT_EXAMPLE' | 'EVENTS_SEARCH';

export type Flags = Partial<Record<Flag, boolean | undefined>>;
let overrides: Flags = {
  // flags already live in prod:
  // can also be used to manually disable a flag in development:
};

const envDefaults: Record<string, boolean> = {
  test: true,
  development: false,
  production: false,
};

export const isEnabled = (flag: Flag): boolean => {
  return (
    overrides[flag] ??
    envDefaults[process.env.REACT_APP_ENVIRONMENT ?? 'development'] ??
    false
  );
};
export const getOverrides = (): Flags => overrides;

export const setCurrentOverrides = (flags?: Record<string, boolean>): void => {
  overrides = Object.entries(overrides).reduce<
    Record<string, boolean | undefined>
  >((acc, [name, val]) => {
    acc[name] = flags && flags[name] !== undefined ? flags[name] : val;
    return acc;
  }, {});
};
const setOverride = (flag: Flag, value: boolean): void => {
  overrides = { ...overrides, [flag]: value };
};
export const disable = (flag: Flag): void => setOverride(flag, false);
export const enable = (flag: Flag): void => setOverride(flag, true);

export const reset = (): void => {
  overrides = {};
};
