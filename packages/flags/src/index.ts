export type Flag =
  | 'PERSISTENT_EXAMPLE'
  | 'WORKING_GROUP_EVENTS'
  | 'ASAP_WORKING_GROUP_EVENTS'
  | 'WORKING_GROUP_SHARED_OUTPUT_BTN'
  | 'WORKING_GROUP_SHARED_OUTPUTS_TAB';

export type Flags = Partial<Record<Flag, boolean | undefined>>;
let overrides: Flags = {
  ASAP_WORKING_GROUP_EVENTS: false,
  // flags already live in prod:
  // can also be used to manually disable a flag in development:
};

const envDefaults: Record<string, boolean> = {
  test: true,
  development: true,
  production: false,
};

export const isEnabled = (flag: Flag): boolean =>
  overrides[flag] ??
  envDefaults[process.env.REACT_APP_ENVIRONMENT ?? 'development'] ??
  false;
export const getOverrides = (): Flags => overrides;

export const setCurrentOverrides = (flags?: Record<string, boolean>): void => {
  if (flags) {
    overrides = Object.entries(flags).reduce<
      Record<string, boolean | undefined>
    >((acc, [name, val]) => {
      acc[name] = flags && flags[name] !== undefined ? flags[name] : val;
      return acc;
    }, overrides);
  }
};
const setOverride = (flag: Flag, value: boolean): void => {
  overrides = { ...overrides, [flag]: value };
};
export const disable = (flag: Flag): void => setOverride(flag, false);
export const enable = (flag: Flag): void => setOverride(flag, true);

export const reset = (): void => {
  overrides = {};
};
