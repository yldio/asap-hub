import css from '@emotion/css';

type TextChild = React.ReactText | boolean | null | undefined;
export type TextChildren = TextChild | ReadonlyArray<TextChild>;

export const spacing = css({
  margin: 0,
  paddingTop: '12px',
  paddingBottom: '12px',
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
