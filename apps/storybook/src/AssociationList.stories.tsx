import { createLabs, createListTeamResponse } from '@asap-hub/fixtures';
import { AssociationList } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Association / List',
  component: AssociationList,
};

export const Team = () => (
  <AssociationList
    associations={createListTeamResponse(
      number('Number of Teams', 6),
    ).items.map(({ displayName, id }) => ({
      displayName,
      id,
    }))}
    type="Team"
    max={number('Maximum', 10)}
  />
);

export const TeamInline = () => (
  <AssociationList
    inline
    associations={createListTeamResponse(
      number('Number of Teams', 6),
    ).items.map(({ displayName, id }) => ({
      displayName,
      id,
    }))}
    type="Team"
    max={number('Maximum', 10)}
  />
);

export const Lab = () => (
  <AssociationList
    associations={createLabs({ labs: number('Number of labs', 2) }).map(
      ({ name, id }) => ({ displayName: name, id }),
    )}
    type="Lab"
    max={number('Maximum', 10)}
  />
);

export const LabInline = () => (
  <AssociationList
    inline
    associations={createLabs({ labs: number('Number of labs', 2) }).map(
      ({ name, id }) => ({ displayName: name, id }),
    )}
    type="Lab"
    max={number('Maximum', 10)}
  />
);
