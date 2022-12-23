import { css } from '@emotion/react';
import { ComponentProps, ReactNode } from 'react';
import { Card } from '../atoms';
import { TabProps, TabbedContent } from './TabbedContent';

const cardStyles = css({
  overflow: 'hidden',
});

type TabbedCardProps<T> = {
  tabs: TabProps<T>[];
  children: (state: { data: T[] }) => ReactNode;
} & Omit<ComponentProps<typeof TabbedContent>, 'children' | 'tabs'>;

const TabbedCard = <T extends object>({
  children,
  ...props
}: TabbedCardProps<T>) => (
  <Card padding={false} overrideStyles={cardStyles}>
    <TabbedContent {...props}>{children}</TabbedContent>
  </Card>
);

export default TabbedCard;
