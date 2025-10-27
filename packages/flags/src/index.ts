export type Flag =
  | 'PERSISTENT_EXAMPLE'
  | 'COMPLIANCE_NOTIFICATION_LIST'
  | 'ANALYTICS_PHASE_TWO'
  | 'PROJECTS_MVP';

export type Flags = Partial<Record<Flag, boolean | string | undefined>>;
let overrides: Flags = {
  // flags already live in prod:
  // can also be used to manually disable a flag in development:
  ANALYTICS_PHASE_TWO: false,
  COMPLIANCE_NOTIFICATION_LIST: '',
  PROJECTS_MVP: false,
};

const envDefaults: Record<string, boolean> = {
  local: true,
  test: true,
  development: true,
  production: false,
};

let currentEnvironment: string | undefined;

export const setEnvironment = (environment?: string) => {
  currentEnvironment = environment;
};

export const isEnabled = (flag: Flag): boolean =>
  !!(
    overrides[flag] ??
    envDefaults[currentEnvironment ?? 'development'] ??
    false
  );
export const getOverrides = (): Flags => overrides;

export const setCurrentOverrides = (
  flags?: Record<string, boolean | string>,
): void => {
  if (flags) {
    overrides = Object.entries(flags).reduce<
      Record<string, boolean | string | undefined>
    >((acc, [name, val]) => {
      acc[name] = flags && flags[name] !== undefined ? flags[name] : val;
      return acc;
    }, overrides);
  }
};
const setOverride = (flag: Flag, value: boolean | string): void => {
  overrides = { ...overrides, [flag]: value };
};
export const disable = (flag: Flag): void => setOverride(flag, false);
export const enable = (flag: Flag, value?: string): void =>
  setOverride(flag, value ?? true);

export const reset = (): void => {
  overrides = {};
};
