/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from '@emotion/react';
import { ButtonHTMLAttributes, FC, ReactNode, useEffect } from 'react';

import {
  captionStyles,
  charcoal,
  ember,
  fern,
  headlineStyles,
  lead,
  paper,
  pine,
  rem,
  rose,
  silver,
  steel,
  tin,
  warning100,
  warning900,
} from './theme';

const borderWidth = 1;

const buttonBase = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: rem(8),

  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderWidth: rem(borderWidth),
  borderRadius: rem(4),

  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'bold',
  lineHeight: 'unset',
  cursor: 'pointer',
  transition: '200ms',

  paddingTop: rem(11 - borderWidth),
  paddingBottom: rem(11 - borderWidth),
  paddingLeft: rem(24 - borderWidth),
  paddingRight: rem(24 - borderWidth),

  ':disabled': {
    cursor: 'default',
    color: tin.rgb,
    borderColor: steel.rgb,
    backgroundColor: silver.rgb,
  },
});

const secondaryButton = css({
  color: charcoal.rgb,
  backgroundColor: paper.rgb,
  borderColor: steel.rgb,
  ':hover:enabled, :focus-visible:enabled': {
    backgroundColor: silver.rgb,
  },
});

const primaryButton = css({
  color: paper.rgb,
  backgroundColor: fern.rgb,
  borderColor: fern.rgb,
  ':hover:enabled, :focus-visible:enabled': {
    backgroundColor: pine.rgb,
    borderColor: pine.rgb,
  },
});

const smallButton = css({
  paddingTop: rem(6 - borderWidth),
  paddingBottom: rem(6 - borderWidth),
  paddingLeft: rem(16 - borderWidth),
  paddingRight: rem(16 - borderWidth),
  fontSize: rem(14),
});

const dangerButton = css({
  color: paper.rgb,
  backgroundColor: ember.rgb,
  borderColor: ember.rgb,
  ':hover:enabled, :focus-visible:enabled': {
    backgroundColor: ember.rgb,
    opacity: 0.85,
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly primary?: boolean;
  readonly danger?: boolean;
  readonly small?: boolean;
};

const variantStyles = (primary: boolean, danger: boolean): SerializedStyles => {
  if (danger) return dangerButton;
  return primary ? primaryButton : secondaryButton;
};

export const Button: FC<ButtonProps> = ({
  primary = false,
  danger = false,
  small = false,
  type = 'button',
  children,
  ...props
}) => (
  <button
    type={type}
    css={[buttonBase, variantStyles(primary, danger), small && smallButton]}
    {...props}
  >
    {children}
  </button>
);

const cardStyles = css({
  boxSizing: 'border-box',
  backgroundColor: paper.rgb,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: steel.rgb,
  borderRadius: rem(8),
  boxShadow: `0px 2px 4px ${steel.rgb}`,
});

export const Card: FC<{
  readonly children: ReactNode;
  readonly overrideStyles?: SerializedStyles;
}> = ({ children, overrideStyles }) => (
  <div css={[cardStyles, overrideStyles]}>{children}</div>
);

export const Headline: FC<{
  readonly level: 1 | 2 | 3 | 4;
  readonly children: ReactNode;
}> = ({ level, children }) => {
  const Tag = `h${level}` as 'h1';
  return <Tag css={headlineStyles[level]}>{children}</Tag>;
};

export const Caption: FC<{ readonly children: ReactNode }> = ({ children }) => (
  <p css={[captionStyles, { color: lead.rgb }]}>{children}</p>
);

const badgeStyles = css({
  ...captionStyles,
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: rem(12),
  paddingLeft: rem(10),
  paddingRight: rem(10),
  paddingTop: rem(2),
  paddingBottom: rem(2),
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
});

export type BadgeTone = 'neutral' | 'warning' | 'error';

const badgeTones: Record<BadgeTone, SerializedStyles> = {
  neutral: css({
    backgroundColor: silver.rgb,
    color: lead.rgb,
  }),
  warning: css({
    backgroundColor: warning100.rgb,
    color: warning900.rgb,
  }),
  error: css({
    backgroundColor: rose.rgb,
    color: ember.rgb,
  }),
};

export const Badge: FC<{
  readonly tone?: BadgeTone;
  readonly children: ReactNode;
}> = ({ tone = 'neutral', children }) => (
  <span css={[badgeStyles, badgeTones[tone]]}>{children}</span>
);

const overlayStyles = css({
  position: 'fixed',
  inset: 0,
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: rem(24),
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
});

const modalCardStyles = css({
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: rem(440),
  maxHeight: '100%',
  overflowY: 'auto',
  padding: rem(24),
  backgroundColor: paper.rgb,
  borderRadius: rem(8),
  boxShadow: `0 ${rem(8)} ${rem(24)} rgba(0, 0, 0, 0.25)`,
});

export const Modal: FC<{
  readonly onClose: () => void;
  readonly label: string;
  readonly children: ReactNode;
}> = ({ onClose, label, children }) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      css={overlayStyles}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div css={modalCardStyles} role="dialog" aria-modal aria-label={label}>
        {children}
      </div>
    </div>
  );
};

export const Spinner: FC<{ readonly label?: string }> = ({
  label = 'Loading',
}) => (
  <p css={{ color: lead.rgb, padding: rem(24) }} role="status">
    {label}
  </p>
);
