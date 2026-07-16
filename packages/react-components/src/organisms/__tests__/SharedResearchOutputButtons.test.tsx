import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import SharedResearchOutputButtons from '../SharedResearchOutputButtons';

const defaultActions = {
  showEdit: false,
  showDuplicate: false,
  showRequestReview: false,
  showAddVersion: false,
  showImportManuscriptVersion: false,
  showSwitchToDraft: false,
  showPublish: false,
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

it.each`
  title                          | action                           | role        | name
  ${'Edit'}                      | ${'showEdit'}                    | ${'link'}   | ${/edit/i}
  ${'Duplicate'}                 | ${'showDuplicate'}               | ${'link'}   | ${/duplicate/i}
  ${'Ready for PM Review'}       | ${'showRequestReview'}           | ${'button'} | ${/ready for pm review/i}
  ${'Import Manuscript Version'} | ${'showImportManuscriptVersion'} | ${'button'} | ${/import manuscript version/i}
  ${'Add Version'}               | ${'showAddVersion'}              | ${'link'}   | ${/add version/i}
  ${'Switch to Draft'}           | ${'showSwitchToDraft'}           | ${'button'} | ${/switch to draft/i}
  ${'Publish'}                   | ${'showPublish'}                 | ${'button'} | ${/publish/i}
`('renders $title when $action is true', ({ action, role, name }) => {
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

it('renders nothing when no actions are available', () => {
  const { container } = render(
    <SharedResearchOutputButtons {...props} actions={{ ...defaultActions }} />,
  );

  expect(container.firstChild).toBeNull();
});
