import {
  createLabs,
  createListTeamResponse,
  createListUserResponse,
} from '@asap-hub/fixtures';
import { SharedResearchCard } from '@asap-hub/react-components';
import { text, date, number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Shared Research / Card',
};

export const Normal = () => (
  <SharedResearchCard
    id="r42"
    link={text('Link', 'https://hub.asap.science')}
    title={text(
      'Title',
      'Tracing the Origin and Progression of Parkinson’s Disease through the Neuro-Immune Interactome',
    )}
    type="Article"
    subTypes={['Code', 'Plasmid', 'Cloning', 'Microscopy & Imaging']}
    created={new Date(
      date('Created Date', new Date(2020, 6, 4, 14, 32)),
    ).toISOString()}
    addedDate={new Date(
      date('Created Date', new Date(2020, 6, 4, 14, 32)),
    ).toISOString()}
    teams={createListTeamResponse(number('Number of Teams', 3)).items}
    labs={createLabs({ labs: number('Number of labs', 2) })}
    authors={createListUserResponse(number('Number of Authors', 5)).items}
  />
);
