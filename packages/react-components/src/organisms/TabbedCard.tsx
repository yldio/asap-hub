import React from 'react';
import { Card, Paragraph, Headline3, Tab } from '../atoms';
import { TabNav } from '../molecules';

export type TabProps = {
  title: string;
  counter?: number;
  content: React.ReactNode;
};

type TabbedCardProps = {
  title?: string;
  description?: string;
  firstTabDisabled?: boolean;
  secondTabDisabled?: boolean;
  firstTab?: TabProps;
  secondTab?: TabProps;
};

const TabbedCard: React.FC<TabbedCardProps> = ({
  title,
  description,
  firstTabDisabled,
  secondTabDisabled,
  firstTab,
  secondTab,
}) => {
  const [active, setActive] = React.useState(true);
  return (
    <Card>
      <Headline3>{title}</Headline3>
      <Paragraph accent="lead">{description}</Paragraph>
      <TabNav>
        <div onClick={() => !firstTabDisabled && setActive(true)}>
          <Tab active={active} disabled={firstTabDisabled}>
            {firstTab?.title} ({firstTab?.counter})
          </Tab>
        </div>
        <div onClick={() => !secondTabDisabled && setActive(false)}>
          <Tab active={!active} disabled={secondTabDisabled}>
            {secondTab?.title} ({secondTab?.counter})
          </Tab>
        </div>
      </TabNav>
      {active && firstTab?.content}
      {!active && secondTab?.content}
    </Card>
  );
};

export default TabbedCard;
