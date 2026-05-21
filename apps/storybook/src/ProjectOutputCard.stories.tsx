import {
  createListTeamResponse,
  createListUserResponse,
} from '@asap-hub/fixtures';
import { ProjectOutputCard } from '@asap-hub/react-components';

import { text, date, number, boolean } from './knobs';

export default {
  title: 'Organisms / Project Outputs / Card',
};

export const Normal = () => (
  <ProjectOutputCard
    keywords={['Etag', 'Exercise']}
    id="r42"
    link={text('Link', 'https://hub.asap.science')}
    title={text('Title', 'Tracing the Origin and Progression of PD')}
    documentType="Article"
    type={'Code'}
    created={new Date(
      date('Created Date', new Date(2020, 6, 4, 14, 32)),
    ).toISOString()}
    addedDate={new Date(
      date('Added Date', new Date(2020, 6, 4, 14, 32)),
    ).toISOString()}
    lastModifiedDate={new Date(
      date('Last Modified', new Date(2021, 6, 4, 14, 32)),
    ).toISOString()}
    teams={createListTeamResponse(number('Number of Teams', 0)).items}
    authors={createListUserResponse(number('Number of Authors', 3)).items}
    projects={[
      { id: 'p1', title: 'Project Alpha', href: '/projects/p1' },
    ]}
    published={boolean('published', true)}
    isInReview={boolean('Is in review', false)}
  />
);

export const TeamBased = () => (
  <ProjectOutputCard
    keywords={['Etag']}
    id="r44"
    link={'https://hub.asap.science'}
    title={'Team-based project output'}
    documentType="Article"
    type={'Code'}
    created={new Date(2020, 6, 4).toISOString()}
    addedDate={new Date(2020, 6, 4).toISOString()}
    lastModifiedDate={new Date(2021, 6, 4).toISOString()}
    teams={createListTeamResponse(2).items}
    authors={createListUserResponse(2).items}
    projects={[
      { id: 'p1', title: 'Project Alpha', href: '/projects/p1' },
    ]}
    published={true}
    isInReview={false}
    source="team"
  />
);

export const Draft = () => (
  <ProjectOutputCard
    keywords={['Etag']}
    id="r43"
    link={'https://hub.asap.science'}
    title={'Draft project output'}
    documentType="Article"
    type={'Code'}
    created={new Date(2020, 6, 4).toISOString()}
    addedDate={new Date(2020, 6, 4).toISOString()}
    lastModifiedDate={new Date(2021, 6, 4).toISOString()}
    teams={[]}
    authors={createListUserResponse(2).items}
    projects={[
      { id: 'p1', title: 'Project Alpha', href: '/projects/p1' },
    ]}
    published={false}
    isInReview={false}
  />
);
