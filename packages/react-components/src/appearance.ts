import { cerulean, fern, magenta, iris } from './colors';

export const ceruleanFernGradientStyles = {
  background: `linear-gradient(to right, ${cerulean.rgb}, ${fern.rgb})`,
} as const;
export const magentaCeruleanGradientStyles = {
  background: `linear-gradient(to right, ${magenta.rgb}, ${cerulean.rgb})`,
} as const;
export const irisCeruleanGradientStyles = {
  background: `linear-gradient(to right, ${iris.rgb}, ${cerulean.rgb})`,
} as const;
