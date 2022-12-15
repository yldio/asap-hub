import { css } from '@emotion/react';
import { ReactNode } from 'react';
import { Card } from '../atoms';
import { TabbedContent } from '.';

const cardStyles = css({
  overflow: 'hidden',
});

export type TabProps<T> = {
  tabTitle: string;
  items: ReadonlyArray<T>;
  truncateFrom?: number;
  disabled?: boolean;
};

type TabbedCardProps<T> = {
  title: string;
  description?: string;
  tabs: TabProps<T>[];
  activeTabIndex?: number;
  getShowMoreText?: (showMore: boolean) => string;
  children: (state: { data: T[] }) => ReactNode;
};

const TabbedCard = <T extends object>({
  title,
  description,
  tabs,
  activeTabIndex = 0,
  getShowMoreText,
  children,
}: TabbedCardProps<T>) => (
  <Card padding={false} overrideStyles={cardStyles}>
    <TabbedContent
      title={title}
      description={description}
      tabs={tabs}
      activeTabIndex={activeTabIndex}
      getShowMoreText={getShowMoreText}
    >
      {children}
    </TabbedContent>
  </Card>
);

export default TabbedCard;
