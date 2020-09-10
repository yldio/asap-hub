import React from 'react';
import { UserResponse } from '@asap-hub/model';
import { PeopleCard } from '../organisms';

interface NetworkPeopleProps {
  readonly people: ReadonlyArray<
    UserResponse & {
      readonly profileHref: string;
    }
  >;
}

const NetworkPeople: React.FC<NetworkPeopleProps> = ({ people }) => (
  <>
    {people.map((person) => {
      const { id } = person;
      return (
        <div key={id}>
          <PeopleCard {...person} />
        </div>
      );
    })}
  </>
);
export default NetworkPeople;
