import { ComponentProps, Fragment, FC } from 'react';

import { ResultList, PeopleCard } from '../organisms';

type NetworkPeopleProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly people: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof PeopleCard>
  >;
};

const NetworkPeople: FC<NetworkPeopleProps> = ({
  people,
  ...cardListProps
}) => (
  <ResultList {...cardListProps}>
    {people.map((person) => (
      <Fragment key={person.id}>
        <PeopleCard {...person} />
      </Fragment>
    ))}
  </ResultList>
);
export default NetworkPeople;
