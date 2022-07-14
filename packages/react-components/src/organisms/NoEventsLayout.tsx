import { css } from '@emotion/react';
import { getButtonStyles } from '../button';
import { perRem } from '../pixels';

const titleStyles = css({
  padding: `${24 / perRem}em`,
  fontSize: `${27 / perRem}em`,
});

const exploreEventsStyles = css(getButtonStyles({ primary: true }), {
  textDecoration: 'none',
});

interface ChildrenProps {
  children: React.ReactNode;
}

const Title: React.FC<ChildrenProps> = ({ children }) => (
  <div css={titleStyles}>
    <strong>{children}</strong>
  </div>
);

const Description: React.FC<ChildrenProps> = ({ children }) => (
  <>
    <span>{children}</span>
    <br />
  </>
);

interface LinkProps extends ChildrenProps {
  link: string;
}

const Link: React.FC<LinkProps> = ({ link, children }) => (
  <a href={link} css={exploreEventsStyles}>
    {children}
  </a>
);

interface CompoundProps {
  Title: React.FC<ChildrenProps>;
  Description: React.FC<ChildrenProps>;
  Link: React.FC<LinkProps>;
}

const NoEventsLayout: React.FC<ChildrenProps> & CompoundProps = ({
  children,
}) => <main css={{ textAlign: 'center' }}>{children}</main>;

NoEventsLayout.Title = Title;
NoEventsLayout.Description = Description;
NoEventsLayout.Link = Link;

export default NoEventsLayout;
