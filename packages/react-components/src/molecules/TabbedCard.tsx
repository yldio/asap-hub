import { GroupResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import React from 'react';
import { Card, Paragraph, Headline3, Tab, Button } from '../atoms';
import { TabNav } from './';

const showMoreStyles = css({
  display: 'flex',
  justifyContent: 'center',
});

export type TabProps = {
  title: string;
  items: GroupResponse[];
  createItem: (group: GroupResponse) => JSX.Element;
  truncateFrom?: number;
};

type TabbedCardProps = {
  title: string;
  description: string;
  tabs: TabProps[];
  activeTab?: number;
};

const TabbedCard: React.FC<TabbedCardProps> = ({
  title,
  description,
  tabs,
}) => {
  const [active, setActive] = React.useState(0);
  const [showMore, setShowMore] = React.useState(false);

  const activeTab = tabs[active];
  const { items, truncateFrom, createItem } = activeTab;
  
  return (
    <Card>
      <Headline3>{title}</Headline3>
      <Paragraph accent="lead">{description}</Paragraph>
      <div>active is {active}</div>
      <TabNav>
        {tabs.map(({ title }, index) => (
          <div
            key={title}
            onClick={() => {
              setShowMore(false);
              setActive(index);
            }}
          >
            <Tab active={index === active}>{title}</Tab>
          </div>
        ))}
      </TabNav>
      {items
        .slice(0, showMore ? undefined : truncateFrom)
        .map((item) => createItem(item))}
      {truncateFrom &&
        items.length >= truncateFrom && (
          <div css={showMoreStyles}>
            <Button linkStyle onClick={() => setShowMore(!showMore)}>
              Show {showMore ? 'less' : 'more'} component
            </Button>
          </div>
        )}
    </Card>
  );
};

export default TabbedCard;
