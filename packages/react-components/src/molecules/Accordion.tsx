import { FC, useState } from 'react';
import { css } from '@emotion/react';
import { Card, Headline5, Paragraph, Link } from '..';
import { lineHeight, perRem, tabletScreen } from '../pixels';
import { chevronDownIcon, externalLinkIcon, infoInfoIcon } from '../icons';
import { isInternalLink } from '../utils';
import {
  charcoal,
  informationInfo500,
  semanticInformationInfo100,
  silver,
  steel,
} from '../colors';

const itemStyles = css({
  borderBottom: `${steel.rgb} solid 1px`,
  '~ div:last-of-type': {
    borderBottom: 'none',
  },
  padding: `${9 / perRem}em 0`,
  margin: `0 ${9 / perRem}em`,
});

const headerStyles = css({
  display: 'grid',
  width: '100%',
  gridColumnGap: `${15 / perRem}em`,
  gridTemplateColumns: 'min-content 1fr min-content',
  padding: `${9 / perRem}em ${15 / perRem}em`,
});

const iconStyles = css({
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,
  alignSelf: 'center',
  svg: {
    transition: '250ms',
    stroke: charcoal.rgb,
    fill: charcoal.rgb,
  },
});

const iconOpenStyles = css({
  svg: {
    transform: 'rotate(180deg)',
  },
});

const bodyStyles = css({
  padding: `0 ${57 / perRem}em`,
});

const hiddenStyles = css({
  maxHeight: 0,
  overflow: 'hidden',
  transition: 'max-height 300ms ease-in-out',
});

const openStyles = css({
  maxHeight: '500px', // value larger than probable content
  transition: 'max-height 200ms ease-in-out',
});

const buttonStyles = css({
  textAlign: 'unset',
  border: 'none',
  outline: 'none',
  backgroundColor: 'unset',

  cursor: 'pointer',
  ':hover': {
    background: silver.rgb,
    borderRadius: `${4 / perRem}em`,
  },
});

const infoItem = css({
  padding: `${15 / perRem}em ${9 / perRem}em ${9 / perRem}em ${24 / perRem}em `,
  display: 'grid',
  gridColumnGap: `${15 / perRem}em`,
  gridTemplateColumns: 'min-content 1fr auto',
  color: informationInfo500.rgb,
  background: semanticInformationInfo100.rgb,
  alignItems: 'center',
  alignContent: 'center',
  rowGap: `${9 / perRem}em`,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    paddingTop: `${9 / perRem}em`,
  },
});

const infoButtonWrap = css({
  gridColumn: 'span 2',
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    gridColumn: 'unset',
  },
});

type AccordionProps = {
  items: {
    icon: JSX.Element;
    title: string;
    description: string;
    href: string;
    hrefText: string;
  }[];
  info?: {
    text: string;
    href: string;
    hrefText: string;
  };
};

const Accordion: FC<AccordionProps> = ({ items, info }) => {
  const [opened, setOpened] = useState<number | undefined>();
  return (
    <Card accent="neutral200" padding={false}>
      <div>
        {items.map(({ icon, title, description, href, hrefText }, index) => (
          <div key={`accordion-${index}`} css={itemStyles}>
            <button
              css={[buttonStyles, headerStyles]}
              onClick={() => setOpened(opened === index ? undefined : index)}
            >
              <div css={iconStyles}>{icon}</div>
              <Headline5>{title}</Headline5>

              <div css={[iconStyles, index === opened && iconOpenStyles]}>
                {chevronDownIcon}
              </div>
            </button>
            <div
              css={[bodyStyles, hiddenStyles, index === opened && openStyles]}
            >
              <Paragraph accent={'lead'}>{description}</Paragraph>
              <div css={{ width: 'fit-content' }}>
                <Link buttonStyle small primary href={href}>
                  {hrefText} {!isInternalLink(href)[0] && externalLinkIcon}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {info && (
        <div css={infoItem}>
          <div css={iconStyles}>{infoInfoIcon}</div>
          <span>{info.text}</span>
          <div css={infoButtonWrap}>
            <Link buttonStyle small noMargin href={info.href}>
              {info.hrefText}
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
};
export default Accordion;
