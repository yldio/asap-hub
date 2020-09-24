import { paper, charcoal, tin, lead } from './colors';

export type ThemeVariant = 'light' | 'grey' | 'dark';
export const defaultThemeVariant: ThemeVariant = 'light';

export const themes: Record<ThemeVariant, string> = {
  light: `background-color: ${paper.rgb}; color: ${charcoal.rgb};`,
  grey: `background-color: ${tin.rgb}; color: ${lead.rgb};`,
  dark: `background-color: ${charcoal.rgb}; color: ${paper.rgb};`,
};
