import { css } from '@emotion/react';
import React from 'react';
import {
  Card,
  Paragraph,
  Headline3,
  TabButton,
  Button,
  Divider,
} from '../atoms';
import { steel } from '../colors';
import { perRem } from '../pixels';
import { TabNav } from '.';
import { paddingStyles } from '../card';

const topDividerStyles = css({
  display: 'flex',
  height: 1,
  flexDirection: 'column',
});

const itemsListWrapper = css({
  display: 'flex',
  flexDirection: 'column',
  marginTop: `${33 / perRem}em`,
  paddingBottom: `${33 / perRem}em`,
});

const truncatedStyles = css({
  paddingBottom: 0,
});

const lastChildExpanded = css({
  '&:last-child': {
    paddingBottom: 0,
  },
});

const showMoreStyles = css({
  display: 'flex',
  justifyContent: 'center',
  paddingTop: `${16 / perRem}em`,
  paddingBottom: `${16 / perRem}em`,
  borderTop: `1px solid ${steel.rgb}`,
  marginTop: `${33 / perRem}em`,
});

export type TabProps<T> = {
  tabTitle: string;
  items: T[];
  createItem: (data: T, index: number) => JSX.Element;
  truncateFrom?: number;
  disabled?: boolean;
};

type TabbedCardProps<T> = {
  title: string;
  description: string;
  tabs: TabProps<T>[];
  activeTabIndex?: number;
};

const TabbedCard = <T extends object>({
  title,
  description,
  tabs,
  activeTabIndex = 0,
}: TabbedCardProps<T>) => {
  const [active, setActive] = React.useState(activeTabIndex);
  const [showMore, setShowMore] = React.useState(false);

  const activeTab = tabs[active];
  const { items, truncateFrom, createItem } = activeTab;
  const showShowMoreButton = truncateFrom && items.length > truncateFrom;
  return (
    <Card padding={false}>
      <div css={[paddingStyles, { paddingBottom: 0 }]}>
        <Headline3>{title}</Headline3>
        <Paragraph hasMargin={false} accent="lead">
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
      <div css={topDividerStyles}>
        <Divider />
      </div>
      <div css={[paddingStyles, { paddingBottom: 0, paddingTop: 0 }]}>
        <div
          css={[
            itemsListWrapper,
            showMore && lastChildExpanded,
            showShowMoreButton && truncatedStyles,
          ]}
        >
          {items
            .slice(0, showMore ? undefined : truncateFrom)
            .map((item, index) => createItem(item, index))}
        </div>
      </div>
      {showShowMoreButton && (
        <div css={showMoreStyles}>
          <Button linkStyle onClick={() => setShowMore(!showMore)}>
            {`View ${showMore ? 'less' : 'more'} interest groups`}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TabbedCard;
