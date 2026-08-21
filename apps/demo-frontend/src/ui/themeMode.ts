export type ThemeMode = 'light' | 'dark' | 'system';

export const themeStorageKey = 'demo-hub.theme';

export const themeModes: readonly ThemeMode[] = ['light', 'dark', 'system'];

const isThemeMode = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system';

export const readThemeMode = (): ThemeMode => {
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    return isThemeMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
};

export const darkMediaQuery = (): MediaQueryList | undefined => {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)');
  } catch {
    return undefined;
  }
};

export const prefersDark = (): boolean => darkMediaQuery()?.matches ?? false;

export const resolveTheme = (mode: ThemeMode): 'light' | 'dark' =>
  mode === 'system' ? (prefersDark() ? 'dark' : 'light') : mode;

export const applyThemeMode = (mode: ThemeMode): void => {
  document.documentElement.dataset.theme = resolveTheme(mode);
};

export const writeThemeMode = (mode: ThemeMode): void => {
  try {
    window.localStorage.setItem(themeStorageKey, mode);
  } catch {
    // a blocked storage should not break theming
  }
  applyThemeMode(mode);
};

export const nextThemeMode = (mode: ThemeMode): ThemeMode =>
  themeModes[(themeModes.indexOf(mode) + 1) % themeModes.length] as ThemeMode;

export const themeModeLabels: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};
