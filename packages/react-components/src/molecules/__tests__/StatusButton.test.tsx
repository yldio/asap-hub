import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import StatusButton from '../StatusButton';

it('renders a StatusButton as Label when canEdit is false', () => {
  render(<StatusButton buttonChildren={() => <>Status</>} />);
  expect(screen.getByRole('button').textContent).toContain('Status');
  expect(screen.getByRole('button')).toBeDisabled();
});

it('renders a StatusButton as dropdown when canEdit is true', () => {
  render(<StatusButton buttonChildren={() => <>Status</>} canEdit={true} />);
  expect(screen.getByRole('button').textContent).toContain('Status');
  expect(screen.getByRole('button')).toBeEnabled();
});

it('renders a StatusButton button item', () => {
  const onClick = jest.fn();
  render(
    <StatusButton buttonChildren={() => <>Example</>}>
      {{ item: 'Example Button', onClick }}
      {{ item: 'Second Item', onClick: jest.fn() }}
    </StatusButton>,
  );
  userEvent.click(screen.getByRole('button'));
  userEvent.click(screen.getByText('Example Button'));

  expect(onClick).toHaveBeenCalled();
});

it('renders a modal on click', () => {
  render(
    <StatusButton buttonChildren={() => <>test</>} canEdit={true}>
      {{ item: '1', onClick: jest.fn() }}
      {{ item: '2', onClick: jest.fn() }}
      {{ item: '3', onClick: jest.fn() }}
    </StatusButton>,
  );
  userEvent.click(screen.getByRole('button'));

  expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
    '1',
    '2',
    '3',
  ]);
});

it('renders items on modal and hides it on outside click', () => {
  jest.spyOn(console, 'error').mockImplementation();
  render(
    <>
      <h1>Element</h1>
      <StatusButton buttonChildren={() => <>test</>} canEdit={true}>
        {{ item: '1', onClick: jest.fn() }}
        {{ item: '2', onClick: jest.fn() }}
        {{ item: '3', onClick: jest.fn() }}
      </StatusButton>
    </>,
  );

  userEvent.click(screen.getByRole('button'));
  screen.getAllByRole('listitem').forEach((e) => expect(e).toBeVisible());
  userEvent.click(screen.getByRole('heading'));
  screen.queryAllByRole('listitem').forEach((e) => expect(e).not.toBeVisible());
});
