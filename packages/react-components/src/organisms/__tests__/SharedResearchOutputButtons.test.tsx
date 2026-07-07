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

it.each([
  ['canEdit', 'link', /edit/i],
  ['canDuplicate', 'link', /duplicate/i],
  ['canRequestReview', 'button', /ready for pm review/i],
  ['canImportManuscriptVersion', 'button', /import manuscript version/i],
  ['canAddVersion', 'link', /add version/i],
  ['canSwitchToDraft', 'button', /switch to draft/i],
  ['canPublish', 'button', /publish/i],
] as const)('renders %s when %s is true', (action, role, name) => {
  const { getByRole, queryByRole, rerender } = render(
    <SharedResearchOutputButtons
      {...props}
      actions={{ ...defaultActions, [action]: false }}
    />,
  );

  expect(queryByRole(role, { name })).not.toBeInTheDocument();

  rerender(
    <SharedResearchOutputButtons
      {...props}
      actions={{ ...defaultActions, [action]: true }}
    />,
  );

  expect(getByRole(role, { name })).toBeInTheDocument();
});
