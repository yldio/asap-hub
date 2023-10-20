import { RelatedResearchCard, article } from '@asap-hub/react-components';
import {
  createListResearchOutputResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import { number, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Related Research Card',
};

export const Normal = () => (
  <RelatedResearchCard
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
    getIconForDocumentType={() => article}
    description={text('Description', 'Find out all shared research outputs.')}
  />
);
