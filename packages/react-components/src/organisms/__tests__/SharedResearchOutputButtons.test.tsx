import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchOutputButtons from '../SharedResearchOutputButtons';

const defaultActions = {
  canEdit: false,
  canDuplicate: false,
  canRequestReview: false,
  canAddVersion: false,
  canImportManuscriptVersion: false,
  canSwitchToDraft: false,
  canPublish: false,
};
const props: ComponentProps<typeof SharedResearchOutputButtons> = {
  id: 'ro1',
  displayReviewModal: false,
  setDisplayReviewModal: jest.fn(),
  displayPublishModal: false,
  setDisplayPublishModal: jest.fn(),
  isInReview: false,
  duplicateLink: 'duplicateLink',
  checkForNewerManuscriptVersion: jest.fn(),
  actions: {
    ...defaultActions,
  },
};

it('displays edit button when user has permission', () => {
  const { queryByTitle, rerender } = render(
    <SharedResearchOutputButtons
      {...props}
      actions={{ ...defaultActions, canEdit: false }}
    />,
  );
  expect(queryByTitle('Edit')).toBeNull();

  rerender(
    <SharedResearchOutputButtons
      {...props}
      actions={{ ...defaultActions, canEdit: true }}
    />,
  );
  expect(queryByTitle('Edit')).toBeInTheDocument();
});
