import { ComponentProps, FC } from 'react';
import AlgoliaHit from '../atoms/AlgoliaHit';

import { ResultList, PeopleCard } from '../organisms';

type NetworkPeopleProps = Omit<
  ComponentProps<typeof ResultList>,
  'children'
> & {
  readonly people: ReadonlyArray<
    { readonly id: string } & ComponentProps<typeof PeopleCard>
  >;
} & Pick<ComponentProps<typeof AlgoliaHit>, 'algoliaQueryId'>;

const NetworkPeople: FC<NetworkPeopleProps> = ({
  people,
  algoliaQueryId,
  ...cardListProps
}) => (
  <ResultList {...cardListProps}>
    {people.map((person, index) => (
      <AlgoliaHit
        key={person.id}
        algoliaQueryId={algoliaQueryId}
        objectId={person.id}
        index={index}
      >
        <PeopleCard {...person} />
      </AlgoliaHit>
    ))}
  </ResultList>
);
export default NetworkPeople;
