import {
  createLabs,
  createListTeamResponse,
  createListUserResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import { SharedResearchCard } from '@asap-hub/react-components';
import { text, date, number, boolean } from './knobs';

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
    documentType="Article"
    type={'Code'}
    created={new Date(
      date('Created Date', new Date(2020, 6, 4, 14, 32)),
    ).toISOString()}
    addedDate={new Date(
      date('Created Date', new Date(2020, 6, 4, 14, 32)),
    ).toISOString()}
    teams={createListTeamResponse(number('Number of Teams', 3)).items}
    labs={createLabs({ labs: number('Number of labs', 2) })}
    authors={createListUserResponse(number('Number of Authors', 5)).items}
    workingGroups={
      number('Number of Working Groups', 1, { max: 1 })
        ? [createWorkingGroupResponse()]
        : undefined
    }
    publishingEntity="Working Group"
    published={boolean('published', true)}
    isInReview={boolean('Is in review', false)}
  />
);
