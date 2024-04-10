export type Flag =
  | 'PERSISTENT_EXAMPLE'
  | 'VERSION_RESEARCH_OUTPUT'
  | 'DISPLAY_EVENTS'
  | 'DISPLAY_ANALYTICS_PRODUCTIVITY';

export type Flags = Partial<Record<Flag, boolean | undefined>>;
let overrides: Flags = {
  // flags already live in prod:
  // can also be used to manually disable a flag in development:
  PERSISTENT_EXAMPLE: false,
  DISPLAY_EVENTS: false,
  DISPLAY_ANALYTICS_PRODUCTIVITY: false,
};

const envDefaults: Record<string, boolean> = {
  local: true,
  test: true,
  development: false,
  production: false,
};

let currentEnvironment: string | undefined;

export const setEnvironment = (environment?: string) => {
  currentEnvironment = environment;
};

export const isEnabled = (flag: Flag): boolean =>
  overrides[flag] ?? envDefaults[currentEnvironment ?? 'development'] ?? false;
export const getOverrides = (): Flags => overrides;

export const setCurrentOverrides = (flags?: Record<string, boolean>): void => {
  console.log(flags, currentEnvironment);
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
