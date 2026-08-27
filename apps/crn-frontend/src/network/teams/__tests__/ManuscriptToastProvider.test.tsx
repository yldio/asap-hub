import { fireEvent, render, screen } from '@testing-library/react';
import { useContext } from 'react';

import {
  ManuscriptToastContext,
  ManuscriptToastProvider,
  ToastAccents,
} from '../ManuscriptToastProvider';

type TriggerProps = {
  type:
    | 'assigned-users'
    | 'manuscript'
    | 'server-validation-error'
    | 'default-error'
    | 'compliance-report'
    | 'reply-to-discussion'
    | 'discussion-started'
    | 'manuscript-status-error'
    | 'milestone-created'
    | '';
  accent?: ToastAccents;
};

const Trigger: React.FC<TriggerProps> = ({ type, accent = 'successLarge' }) => {
  const { setFormType } = useContext(ManuscriptToastContext);
  return (
    <button type="button" onClick={() => setFormType({ type, accent })}>
      trigger
    </button>
  );
};

const renderWithTrigger = (props: TriggerProps) =>
  render(
    <ManuscriptToastProvider>
      <Trigger {...props} />
    </ManuscriptToastProvider>,
  );

it('does not render a toast by default', () => {
  renderWithTrigger({ type: '' });
  expect(
    screen.queryByRole('button', { name: 'Close' }),
  ).not.toBeInTheDocument();
});

it('provides a no-op setFormType when used outside the provider', () => {
  render(<Trigger type="manuscript" />);

  expect(() => fireEvent.click(screen.getByText('trigger'))).not.toThrow();
  expect(
    screen.queryByText('Manuscript submitted successfully.'),
  ).not.toBeInTheDocument();
});

it.each`
  type                         | message
  ${'assigned-users'}          | ${'User(s) assigned to a manuscript successfully.'}
  ${'manuscript'}              | ${'Manuscript submitted successfully.'}
  ${'server-validation-error'} | ${'There are some errors in the form. Please correct the fields below.'}
  ${'default-error'}           | ${'An error has occurred. Please try again later.'}
  ${'compliance-report'}       | ${'Compliance Report submitted successfully.'}
  ${'reply-to-discussion'}     | ${'Replied to discussion successfully.'}
  ${'discussion-started'}      | ${'Discussion started successfully.'}
  ${'milestone-created'}       | ${'Milestone added successfully. It now appears in the milestone table according to its related aim(s).'}
`(
  'renders the "$type" toast message when the form type is set',
  ({ type, message }: { type: TriggerProps['type']; message: string }) => {
    renderWithTrigger({ type });

    fireEvent.click(screen.getByText('trigger'));

    expect(screen.getByText(message)).toBeVisible();
  },
);

it('renders the manuscript status error message', () => {
  renderWithTrigger({ type: 'manuscript-status-error', accent: 'error' });

  fireEvent.click(screen.getByText('trigger'));

  expect(
    screen.getByText(/The manuscript status has been changed/i),
  ).toBeVisible();
});

it('hides the toast when the close button is clicked', () => {
  renderWithTrigger({ type: 'manuscript' });

  fireEvent.click(screen.getByText('trigger'));
  expect(screen.getByText('Manuscript submitted successfully.')).toBeVisible();

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));

  expect(
    screen.queryByText('Manuscript submitted successfully.'),
  ).not.toBeInTheDocument();
});
