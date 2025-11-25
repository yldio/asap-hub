import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MenuButton from '../MenuButton';

it('renders a button to open the menu', () => {
  const { getByLabelText, getByTitle } = render(<MenuButton />);
  expect(getByLabelText(/toggle menu/i)).toContainElement(getByTitle(/menu/i));
});

describe('when open', () => {
  it('renders a button to close the menu', () => {
    const { getByLabelText, getByTitle } = render(<MenuButton open />);
    expect(getByLabelText(/toggle menu/i)).toContainElement(
      getByTitle(/close/i),
    );
  });
});

it('triggers the click event', () => {
  const handleClick = jest.fn();
  const { getByLabelText } = render(<MenuButton onClick={handleClick} />);

  await userEvent.click(getByLabelText(/toggle menu/i));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
