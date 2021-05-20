import { cerulean, fern, magenta } from './colors';

export const ceruleanFernGradientStyles = {
  background: `linear-gradient(to right, ${cerulean.rgb}, ${fern.rgb})`,
} as const;
export const magentaCeruleanGradientStyles = {
  background: `linear-gradient(to right, ${magenta.rgb}, ${cerulean.rgb})`,
} as const;
