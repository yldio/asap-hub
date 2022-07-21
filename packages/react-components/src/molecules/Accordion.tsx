import { FC, useState } from 'react';
import { css } from '@emotion/react';
import { Card, Headline5, Paragraph, Link } from '..';
import { lineHeight, perRem } from '../pixels';
import { chevronDownIcon, externalLinkIcon } from '../icons';
import { isInternalLink } from '../utils';
import { charcoal, silver, steel } from '../colors';

const containerStyles = css({
  padding: `0 ${9 / perRem}em`,
});

const itemStyles = css({
  borderBottom: `${steel.rgb} solid 1px`,
  '~ div:last-of-type': {
    borderBottom: 'none',
  },
  padding: `${9 / perRem}em 0`,
});

const headerStyles = css({
  display: 'grid',
  width: '100%',
  gridColumnGap: `${15 / perRem}em`,
  gridTemplateColumns: 'min-content 1fr min-content',
  padding: `${9 / perRem}em ${15 / perRem}em`,
  cursor: 'pointer',

  ':hover': {
    background: silver.rgb,
    borderRadius: `${4 / perRem}em`,
  },
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

const expandButtonStyles = css({
  textAlign: 'unset',
  border: 'none',
  outline: 'none',
  backgroundColor: 'unset',
});

type AccordionProps = {
  items: {
    icon: JSX.Element;
    title: string;
    description: string;
    href: string;
    hrefText: string;
  }[];
};

const Accordion: FC<AccordionProps> = ({ items }) => {
  const [opened, setOpened] = useState<number | undefined>();
  return (
    <Card accent="neutral200" padding={false}>
      <div css={containerStyles}>
        {items.map(({ icon, title, description, href, hrefText }, index) => (
          <div key={`accordion-${index}`} css={itemStyles}>
            <button
              css={[expandButtonStyles, headerStyles]}
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
    </Card>
  );
};
export default Accordion;
