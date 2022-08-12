export interface OpaqueColor {
  r: number;
  g: number;
  b: number;
  rgb: string;
  rgba: string;
  hex: string;
}
export interface TransparentColor {
  r: number;
  g: number;
  b: number;
  a: number;
  rgba: string;
}

export function color(r: number, g: number, b: number): OpaqueColor;
export function color(
  r: number,
  g: number,
  b: number,
  a: number,
): TransparentColor;
export function color(
  r: number,
  g: number,
  b: number,
  a?: number,
): OpaqueColor | TransparentColor {
  return typeof a === 'number'
    ? {
        r,
        g,
        b,
        a,
        rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
      }
    : {
        r,
        g,
        b,
        rgb: `rgb(${r}, ${g}, ${b})`,
        rgba: `rgba(${r}, ${g}, ${b}, 1)`,
        hex:
          // eslint-disable-next-line prefer-template
          '#' +
          r.toString(16).padStart(2, '0') +
          g.toString(16).padStart(2, '0') +
          b.toString(16).padStart(2, '0'),
      };
}

export const colorWithTransparency = (
  opaqueColor: OpaqueColor,
  a: number,
): TransparentColor => color(opaqueColor.r, opaqueColor.g, opaqueColor.b, a);

// Monochrome
export const paper = color(255, 255, 255);
export const pearl = color(252, 253, 254);
export const silver = color(237, 241, 243);
export const steel = color(223, 229, 234);
export const tin = color(194, 201, 206);
export const lead = color(77, 100, 107);
export const charcoal = color(0, 34, 44);

// Accent
export const ember = color(205, 20, 38);
export const pepper = color(176, 10, 26);
export const rose = color(247, 232, 234);

export const sandstone = color(233, 166, 76);
export const clay = color(206, 128, 26);
export const apricot = color(248, 237, 222);

export const fern = color(52, 162, 112);
export const pine = color(40, 121, 83);
export const mint = color(228, 245, 238);

export const cerulean = color(0, 140, 198);
export const denim = color(0, 106, 146);
export const sky = color(230, 243, 249);

export const prussian = color(0, 93, 129);
export const space = color(0, 69, 97);
export const azure = color(231, 247, 254);

export const magenta = color(207, 47, 179);
export const berry = color(154, 35, 134);
export const lilac = color(248, 234, 247);

export const iris = color(140, 78, 159);
export const mauve = color(105, 59, 119);
export const lavender = color(242, 237, 245);

export const info = color(12, 141, 195);

export const neutral200 = color(246, 249, 251);
