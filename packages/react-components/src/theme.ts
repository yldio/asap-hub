import { paper, charcoal, tin, lead } from './colors';

export type ThemeVariant = 'light' | 'grey' | 'dark';
export const defaultThemeVariant: ThemeVariant = 'light';

export const themes: Record<
  ThemeVariant,
  { backgroundColor: string; color: string }
> = {
  light: { backgroundColor: paper.rgb, color: charcoal.rgb },
  grey: { backgroundColor: tin.rgb, color: lead.rgb },
  dark: { backgroundColor: charcoal.rgb, color: paper.rgb },
};
