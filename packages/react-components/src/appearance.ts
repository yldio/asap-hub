import { cerulean, fern, magenta } from './colors';

export const ceruleanFernGradientStyles = {
  backgroundImage: `linear-gradient(to right, ${cerulean.rgb}, ${fern.rgb})`,
} as const;
export const magentaCeruleanGradientStyles = {
  backgroundImage: `linear-gradient(to right, ${magenta.rgb}, ${cerulean.rgb})`,
} as const;
