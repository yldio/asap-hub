export type Flag = 'PERSISTENT_EXAMPLE' | 'ROMS_FORM';

export type Flags = Partial<Record<Flag, boolean>>;
let overrides: Flags = {
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
  envDefaults[process.env.NODE_ENV ?? 'development'] ??
  false;

export const getOverrides = (): Flags => overrides;

export const setCurrentOverrides = (flags?: Record<string, boolean>): void => {
  overrides = Object.entries(overrides).reduce<Record<string, boolean>>(
    (acc, [name, val]) => {
      if (typeof val === 'boolean') {
        acc[name] = flags && flags[name] !== undefined ? flags[name] : val;
      }
      return acc;
    },
    {},
  );
};
export const disable = (flag: Flag): void => {
  overrides = { ...overrides, [flag]: false };
};
export const reset = (): void => {
  overrides = {};
};
