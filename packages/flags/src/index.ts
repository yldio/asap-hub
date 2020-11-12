export type Flag = 'PERSISTENT_EXAMPLE' | 'PROFILE_EDITING';
export type Flags = Partial<Record<Flag, boolean>>;
let overrides: Flags = {
  // can also be used to manually disable a flag in development
};

const envDefaults: Record<string, boolean> = {
  test: true,
  development: true,
  production: false,
};

export const isEnabled = (flag: Flag): boolean => {
  return (
    overrides[flag] ??
    envDefaults[process.env.NODE_ENV ?? 'development'] ??
    false
  );
};

export const getOverrides = (): Flags => overrides;
export const disable = (flag: Flag): void => {
  overrides = { ...overrides, [flag]: false };
};
export const reset = (): void => {
  overrides = {};
};
