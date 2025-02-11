import { render, fireEvent } from '@testing-library/react';

import DropdownButton from '../DropdownButton';

it('renders a DropdownButton', () => {
  const { getByRole } = render(
    <DropdownButton buttonChildren={() => <>Example</>} />,
  );
  expect(getByRole('button').textContent).toContain('Example');
});
it('renders a DropdownButton link item', () => {
  const { getByText, getByRole } = render(
    <DropdownButton buttonChildren={() => <>Example</>}>
      {{ item: 'Link', href: 'http://example.com' }}
      {{ item: 'Second Item', href: '#' }}
    </DropdownButton>,
  );
  fireEvent.click(getByRole('button'));
  expect(getByText('Link')).toBeVisible();
  expect(getByText('Link').closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});

it('renders a dropdownButton button item', () => {
  const onClick = jest.fn();
  const { getByText, getByRole } = render(
    <DropdownButton buttonChildren={() => <>Example</>}>
      {{ item: 'Example Button', onClick }}
      {{ item: 'Second Item', href: '#' }}
    </DropdownButton>,
  );
  fireEvent.click(getByRole('button'));
  fireEvent.click(getByText('Example Button'));

  expect(onClick).toHaveBeenCalled();
});

it('renders a modal on click', () => {
  const { getByRole, getAllByRole } = render(
    <DropdownButton buttonChildren={() => <>test</>}>
      {{ item: '1', href: '#' }}
      {{ item: '2', href: '#' }}
      {{ item: '3', href: '#' }}
    </DropdownButton>,
  );

  fireEvent.click(getByRole('button'));
  expect(getAllByRole('listitem').map((li) => li.textContent)).toEqual([
    '1',
    '2',
    '3',
  ]);
});

it('renders calendar links on modal and hides it on outside click', () => {
  const { getByRole, getAllByRole, queryAllByRole } = render(
    <>
      <h1>Element</h1>
      <DropdownButton buttonChildren={() => <>test</>}>
        {{ item: '1', href: '#' }}
        {{ item: '2', href: '#' }}
        {{ item: '3', href: '#' }}
      </DropdownButton>
    </>,
  );

  fireEvent.click(getByRole('button'));
  getAllByRole('listitem').forEach((e) => expect(e).toBeVisible());
  fireEvent.mouseDown(getByRole('heading'));
  queryAllByRole('listitem').forEach((e) => expect(e).not.toBeVisible());
});

it('can render title and inner items', () => {
  const { getByRole, getAllByRole } = render(
    <>
      <h1>Element</h1>
      <DropdownButton buttonChildren={() => <>test</>}>
        {{ item: 'title', href: '#', type: 'title' }}
        {{ item: 'inner element', href: '#', type: 'inner' }}
      </DropdownButton>
    </>,
  );
  fireEvent.click(getByRole('button'));
  getAllByRole('listitem').forEach((e) => expect(e).toBeVisible());
});

it('closes menu when clicking an option', () => {
  const { getByRole, getByText, queryByText } = render(
    <DropdownButton buttonChildren={() => <>test</>}>
      {{ item: 'Option 1', href: '#' }}
      {{ item: 'Option 2', href: '#' }}
    </DropdownButton>,
  );

  fireEvent.click(getByRole('button'));
  expect(getByText('Option 1')).toBeVisible();

  fireEvent.click(getByText('Option 1'));

  expect(queryByText('Option 1')).not.toBeVisible();
});
