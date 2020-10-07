import React, { ComponentProps } from 'react';

import { PeopleCard } from '../organisms';
import CardList from '../organisms/CardList';

type NetworkPeopleProps = Omit<ComponentProps<typeof CardList>, 'children'> & {
  readonly people: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof PeopleCard>
  >;
};

const NetworkPeople: React.FC<NetworkPeopleProps> = ({
  people,
  ...cardListProps
}) => (
  <CardList {...cardListProps}>
    {people.map(({ id, ...person }) => (
      <React.Fragment key={id}>
        <PeopleCard {...person} />
      </React.Fragment>
    ))}
  </CardList>
);
export default NetworkPeople;
