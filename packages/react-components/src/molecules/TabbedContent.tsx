import { css } from '@emotion/react';
import React, { ReactNode, useEffect } from 'react';
import { Paragraph, Headline3, TabButton, Button } from '../atoms';
import { steel } from '../colors';
import { perRem, rem } from '../pixels';
import { TabNav } from '.';
import { paddingStyles } from '../card';

const headerStyles = css({
  paddingBottom: 0,
  borderBottom: `1px solid ${steel.rgb}`,
});

const showMoreStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: `${16 / perRem}em`,
  paddingBottom: `${16 / perRem}em`,
  borderTop: `1px solid ${steel.rgb}`,
});

const emptyContainer = css({
  padding: `${rem(20)} 0`,
});

export type TabProps<T> = {
  tabTitle: string;
  items: ReadonlyArray<T>;
  truncateFrom?: number;
  disabled?: boolean;
  empty: React.ReactNode;
};

type TabbedCardProps<T> = {
  title?: string;
  description?: string;
  tabs: TabProps<T>[];
  activeTabIndex?: number;
  getShowMoreText?: (showMore: boolean) => string;
  children: (state: { data: T[] }) => ReactNode;
};

export const TabbedContent = <T extends object>({
  title,
  description,
  tabs,
  activeTabIndex = 0,
  getShowMoreText,
  children,
}: TabbedCardProps<T>) => {
  useEffect(() => setActive(activeTabIndex), [activeTabIndex]);
  const [active, setActive] = React.useState(activeTabIndex);
  const [showMore, setShowMore] = React.useState(false);
  const { items, truncateFrom, empty } = tabs[active];
  const displayShowMoreButton =
    getShowMoreText && truncateFrom && items.length > truncateFrom;

  return (
    <div>
      <div css={[paddingStyles, headerStyles]}>
        <Headline3>{title}</Headline3>
        <Paragraph noMargin accent="lead">
          {description}
        </Paragraph>
        <TabNav>
          {tabs.map(({ tabTitle, disabled }, index) => (
            <TabButton
              key={tabTitle}
              active={index === active}
              onClick={() => {
                setShowMore(false);
                setActive(index);
              }}
              disabled={disabled}
            >
              {tabTitle}
            </TabButton>
          ))}
        </TabNav>
      </div>
      <div css={[paddingStyles, { paddingBottom: 0, paddingTop: 0 }]}>
        {items.length ? (
          children({
            data: items.slice(0, showMore ? undefined : truncateFrom),
          })
        ) : (
          <div css={emptyContainer}>{empty}</div>
        )}
      </div>
      {displayShowMoreButton && (
        <div css={showMoreStyles}>
          <Button linkStyle onClick={() => setShowMore(!showMore)}>
            {getShowMoreText(showMore)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TabbedContent;
