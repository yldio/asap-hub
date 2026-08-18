export { rem, lineHeight, perRem } from '@asap-hub/react-components/src/pixels';
export {
  fontStyles,
  captionStyles,
  headlineStyles,
  layoutStyles,
} from '@asap-hub/react-components/src/text';

export type ThemeColor = { readonly rgb: string };

const token = (name: string): ThemeColor => ({ rgb: `var(--demo-${name})` });

export const paper = token('paper');
export const pearl = token('pearl');
export const silver = token('silver');
export const steel = token('steel');
export const tin = token('tin');
export const lead = token('lead');
export const charcoal = token('charcoal');

export const ember = token('ember');
export const rose = token('rose');

export const fern = token('fern');
export const pine = token('pine');
export const mint = token('mint');

export const cerulean = token('cerulean');
export const denim = token('denim');

export const info100 = token('info100');
export const info500 = token('info500');

export const neutral200 = token('neutral200');
export const neutral300 = token('neutral300');

export const warning100 = token('warning100');
export const warning500 = token('warning500');
export const warning900 = token('warning900');

export const overlay = token('overlay');
export const shadowSoft = token('shadow-soft');
export const shadowMedium = token('shadow-medium');
export const shadowStrong = token('shadow-strong');

export const themes = {
  light: { backgroundColor: paper.rgb, color: charcoal.rgb },
  grey: { backgroundColor: tin.rgb, color: lead.rgb },
  dark: { backgroundColor: charcoal.rgb, color: paper.rgb },
} as const;
