import { RelatedResearch } from '@asap-hub/react-components';
import {
  createListResearchOutputResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Related Research',
};

export const Normal = () => (
  <RelatedResearch
    relatedResearch={[
      {
        ...createResearchOutputResponse(),
        documentType: 'Bioinformatics',
        title: 'Bioinformatics research no1 that will eventually get ellipsed',
        teams: [{ id: '1', displayName: 'Team 1' }],
      },
      {
        ...createResearchOutputResponse(),
        documentType: 'Article',
        type: 'Preprint',
        title: 'Article research no1',
        teams: [
          { id: '1', displayName: 'Team 1' },
          { id: '2', displayName: 'Team 2' },
        ],
      },
      ...createListResearchOutputResponse(
        number('Additional related research', 0),
      ).items,
    ]}
  />
);
