import { render, fireEvent } from '@testing-library/react';

import DropdownButton from '../DropdownButton';

it('renders a dropdownButton button', () => {
  const { getByRole } = render(
    <DropdownButton buttonChildren={() => <>Example</>} />,
  );
  expect(getByRole('button').textContent).toContain('Example');
});

it('renders a modal on click', () => {
  const { getByRole, getAllByRole } = render(
    <DropdownButton buttonChildren={() => <>test</>}>
      <div>1</div>
      <div>2</div>
      <div>3</div>
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
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </DropdownButton>
    </>,
  );

  fireEvent.click(getByRole('button'));
  getAllByRole('listitem').forEach((e) => expect(e).toBeVisible());
  fireEvent.mouseDown(getByRole('heading'));
  queryAllByRole('listitem').forEach((e) => expect(e).not.toBeVisible());
});
