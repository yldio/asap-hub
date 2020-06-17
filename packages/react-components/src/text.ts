import { charcoal, paper } from './colors';
import { perRem } from './pixels';

type TextChild = React.ReactText | boolean | null | undefined;
export type TextChildren = TextChild | ReadonlyArray<TextChild>;

export const fontStyles = {
  fontFamily: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif",
  fontSize: `${perRem}px`,
  lineHeight: `${24 / 17}em`,

  backgroundColor: paper.rgb,
  color: charcoal.rgb,
};
export const layoutStyles = {
  margin: 0,

  paddingTop: '12px',
  paddingBottom: '12px',

  ':empty': {
    display: 'none',
  },
};

export type AccentColorName =
  | 'ember'
  | 'pepper'
  | 'sandstone'
  | 'clay'
  | 'pine'
  | 'fern'
  | 'cerulean'
  | 'denim'
  | 'prussian'
  | 'space'
  | 'berry'
  | 'magenta'
  | 'iris'
  | 'mauve';
