import { render, fireEvent } from '@testing-library/react';

import DropdownButton from '../DropdownButton';

it('renders a DropdownButton', () => {
  const { getByRole } = render(
    <DropdownButton buttonChildren={() => <>Example</>} />,
  );
  expect(getByRole('button').textContent).toContain('Example');
});

it('renders a DropdownButton link item', () => {
  const { getByText } = render(
    <DropdownButton buttonChildren={() => <>Example</>}>
      {{ item: 'example', href: 'http://example.com' }}
      {{ item: 'link2', href: '#' }}
    </DropdownButton>,
  );
  expect(getByText('example').closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});

it('renders a dropdownButton button item', () => {
  const onClick = jest.fn();
  const { getByText, getByRole } = render(
    <DropdownButton buttonChildren={() => <>Example</>}>
      {{ item: 'Example Button', onClick }}
      {{ item: 'link2', href: '#' }}
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
