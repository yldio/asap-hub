import { fireEvent, render, screen } from '@testing-library/react';
import EditUserAvatar from '../EditUserAvatar';

const props = {
  firstName: 'John',
  lastName: 'Doe',
  onImageSelect: jest.fn(),
  onImageRemove: jest.fn(),
};

beforeEach(jest.resetAllMocks);

it('renders the profile photo label', () => {
  render(<EditUserAvatar {...props} />);
  expect(screen.getByText(/profile photo/i)).toBeVisible();
});

it('calls onImageSelect with the chosen file', () => {
  render(<EditUserAvatar {...props} />);
  const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
  const input = screen.getByLabelText(/upload profile photo/i, {
    selector: 'input',
  });

  fireEvent.change(input, { target: { files: [file] } });

  expect(props.onImageSelect).toHaveBeenCalledWith(file);
});

it('shows the remove button only when an avatar exists', () => {
  const { rerender } = render(<EditUserAvatar {...props} />);
  expect(
    screen.queryByRole('button', { name: /remove/i }),
  ).not.toBeInTheDocument();

  rerender(<EditUserAvatar {...props} avatarUrl="https://example.com/a.png" />);
  expect(screen.getByRole('button', { name: /remove/i })).toBeVisible();
});

it('calls onImageRemove when the remove button is clicked', () => {
  render(<EditUserAvatar {...props} avatarUrl="https://example.com/a.png" />);

  fireEvent.click(screen.getByRole('button', { name: /remove/i }));

  expect(props.onImageRemove).toHaveBeenCalled();
});

it('disables the controls when not enabled', () => {
  render(
    <EditUserAvatar
      {...props}
      avatarUrl="https://example.com/a.png"
      enabled={false}
    />,
  );

  expect(
    screen.getByLabelText(/upload profile photo/i, { selector: 'input' }),
  ).toBeDisabled();
  expect(screen.getByRole('button', { name: /remove/i })).toBeDisabled();
});
