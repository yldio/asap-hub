import { render, screen } from '@testing-library/react';

import ManuscriptFormModals from '../ManuscriptFormModals';

it('renders default cancellation title and description', () => {
  render(
    <ManuscriptFormModals
      modal={'cancel'}
      setModal={jest.fn}
      handleSubmit={jest.fn}
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Cancel manuscript submission/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Cancelling now will result in the loss of all entered data and will exit you from the submission process.',
    ),
  ).toBeInTheDocument();
});

it('renders edit cancellation title and description when isEditMode is true', () => {
  render(
    <ManuscriptFormModals
      modal={'cancel'}
      setModal={jest.fn}
      handleSubmit={jest.fn}
      isEditMode
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Cancel manuscript edits/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Cancelling now will result in the loss of all edited data and will exit you from the editing process.',
    ),
  ).toBeInTheDocument();
});
