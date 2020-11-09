type Flag = 'PERSISTENT_EXAMPLE' | 'PROFILE_EDITING';
let overrides: Partial<Record<Flag, boolean>> = {
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

export const disable = (flag: Flag): void => {
  overrides[flag] = false;
};
export const reset = (): void => {
  overrides = {};
};
