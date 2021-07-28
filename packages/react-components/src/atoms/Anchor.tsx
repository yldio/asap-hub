import { AnchorHTMLAttributes, ComponentProps } from 'react';
import { HashLink } from 'react-router-hash-link';
import { css } from '@emotion/react';

import { isInternalLink } from '../utils';
import { useHasRouter } from '../routing';

const resetStyles = css({
  outline: 'none',
  textDecoration: 'none',
  color: 'unset',
});

// Lint rules don't understand abstractions ...
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable react/jsx-no-target-blank */

type AnchorProps = {
  // hrefs may conditionally be undefined, but the prop is mandatory so it cannot be forgotten
  href: string | undefined;
  enabled?: boolean;
} & Omit<ComponentProps<typeof HashLink>, 'to' | 'smooth'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'target' | 'rel'>;
const Anchor: React.FC<AnchorProps> = ({ href, enabled = true, ...props }) => {
  const [internal, url] =
    enabled && href ? isInternalLink(href) : [false, undefined];
  if (useHasRouter() && url && internal) {
    return <HashLink {...props} to={url} smooth css={resetStyles} />;
  }
  return (
    <a
      {...props}
      href={(enabled && href) || undefined}
      target={internal ? undefined : '_blank'}
      rel={internal ? undefined : 'noreferrer noopener'}
      css={resetStyles}
    />
  );
};

export default Anchor;
