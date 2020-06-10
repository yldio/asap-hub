import css from '@emotion/css';

type TextChild = React.ReactText | boolean | null | undefined;
export type TextChildren = TextChild | ReadonlyArray<TextChild>;

export const commonStyles = css({
  margin: 0,

  paddingTop: '12px',
  paddingBottom: '12px',

  ':empty': {
    display: 'none',
  },
});

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
