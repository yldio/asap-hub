import { css, Theme } from '@emotion/react';
import { steel, mint, tin, neutral900, pine, charcoal } from '../colors';
import { crossSmallIcon } from '../icons';
import { perRem } from '../pixels';
import Ellipsis from './Ellipsis';

const borderWidth = 1;
const containerStyles = css({
  display: 'flex',
  cursor: 'default',
  justifyContent: 'center',
  alignItems: 'center',
});

const styles = css({
  padding: `${5 / perRem}em ${15 / perRem}em ${5 / perRem}em`,

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  borderStyle: 'solid',
  borderWidth: `${borderWidth}px`,
  borderColor: steel.rgb,
  borderRadius: `${18 / perRem}em`,
});

const highlightStyles = css({
  backgroundColor: mint.rgb,
});

const hoverStyles = ({
  primary100 = mint,
  primary900 = pine,
}: Theme['colors'] = {}) =>
  css({
    ':hover': {
      backgroundColor: primary100.rgba,
      borderColor: primary900.rgba,
      color: primary900.rgba,
    },
  });

const disabledStyles = css({
  borderColor: tin.rgb,
  color: tin.rgb,
});

const iconStyles = css({
  display: 'flex',
  marginLeft: `${8 / perRem}em`,
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
  svg: {
    fill: neutral900.rgba,
  },
  cursor: 'pointer',
});

type TagProps = {
  readonly enabled?: boolean;
  readonly highlight?: boolean;
  readonly children?: React.ReactNode;
  readonly title?: string;
} & (RemoveTagProps | TagWithHrefProps);

type RemoveTagProps = {
  readonly onRemove: () => void;
  readonly href?: undefined;
};
type TagWithHrefProps = {
  readonly href?: string;
  readonly onRemove?: undefined;
};

const ConditionalLinkWrapper: React.FC<{
  href?: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <>
    {href ? (
      <a href={href} style={{ color: charcoal.rgb, textDecoration: 'inherit' }}>
        {children}
      </a>
    ) : (
      children
    )}
  </>
);

const Tag: React.FC<TagProps> = ({
  children,
  highlight = false,
  enabled = true,
  href,
  onRemove,
  title,
}) => (
  <div css={containerStyles} title={title}>
    <ConditionalLinkWrapper href={enabled ? href : undefined}>
      <div
        css={({ colors }) => [
          styles,
          ...(enabled
            ? [highlight && highlightStyles, !!href && hoverStyles(colors)]
            : [disabledStyles]),
        ]}
      >
        <Ellipsis>{children}</Ellipsis>
        {!!onRemove && enabled && (
          <button css={iconStyles} onClick={onRemove}>
            {crossSmallIcon}
          </button>
        )}
      </div>
    </ConditionalLinkWrapper>
  </div>
);

export default Tag;
