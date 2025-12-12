import { ComponentProps } from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ToolCard from '../ToolCard';

const props: ComponentProps<typeof ToolCard> = {
  name: '',
  description: '',
  editHref: '/wrong',
  url: 'http://example.com',
};
it('renders the title and description', () => {
  const { getByRole, getByText } = render(
    <ToolCard {...props} name="LinkName" description="LinkDescription" />,
  );
  expect(getByRole('heading').textContent).toEqual('LinkName');
  expect(getByRole('heading').tagName).toEqual('H3');
  expect(getByText('LinkDescription')).toBeVisible();
});

it('renders slack logo from properties', () => {
  const { getByTitle } = render(
    <ToolCard {...props} url="https://asap.slack.com/wrong" />,
  );
  expect(getByTitle('Slack')).toBeInTheDocument();
});

it('renders default logo from properties', () => {
  const { getByTitle } = render(
    <ToolCard {...props} url="https://example.com" />,
  );
  expect(getByTitle('Placeholder')).toBeInTheDocument();
});

it('renders default logo from properties on invalid url', () => {
  const { getByTitle } = render(<ToolCard {...props} url="example.com" />);
  expect(getByTitle('Placeholder')).toBeInTheDocument();
});

it('renders the edit link', () => {
  const { getByText } = render(<ToolCard {...props} editHref="/link/0" />);
  expect(getByText(/edit/i)).toHaveAttribute('href', '/link/0');
});

it('renders a button to delete', async () => {
  const handleDelete = jest.fn();
  const { getByText } = render(<ToolCard {...props} onDelete={handleDelete} />);

  await userEvent.click(getByText(/delete/i));
  await waitFor(() => expect(handleDelete).toHaveBeenCalled());
});
it('refuses to delete again', async () => {
  const handleDelete = jest.fn().mockReturnValue(new Promise(() => {}));
  const { getByText } = render(<ToolCard {...props} onDelete={handleDelete} />);

  await userEvent.click(getByText(/delete/i));
  expect(handleDelete).toHaveBeenCalled();
  handleDelete.mockClear();

  await userEvent.click(getByText(/deleting/i));
  expect(handleDelete).not.toHaveBeenCalled();
});
