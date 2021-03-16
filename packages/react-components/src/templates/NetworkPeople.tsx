import React, { ComponentProps } from 'react';

import { ResultList, PeopleCard } from '../organisms';

type NetworkPeopleProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly people: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof PeopleCard>
  >;
};

const NetworkPeople: React.FC<NetworkPeopleProps> = ({
  people,
  ...cardListProps
}) => (
  <ResultList {...cardListProps}>
    {people.map((person) => (
      <React.Fragment key={person.id}>
        <PeopleCard {...person} />
      </React.Fragment>
    ))}
  </ResultList>
);
export default NetworkPeople;
