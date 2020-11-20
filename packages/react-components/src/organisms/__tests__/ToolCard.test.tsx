import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ToolCard from '../ToolCard';

const props: ComponentProps<typeof ToolCard> = {
  name: '',
  description: '',
  href: '/wrong',
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

it('renders link from properties', () => {
  const { getByText } = render(<ToolCard {...props} href="/link/0" />);
  expect(getByText('Edit Link')).toHaveAttribute('href', '/link/0');
});

it('renders slack logo from properties', () => {
  const { getByTitle } = render(
    <ToolCard {...props} url="https://asap.slack.com/wrong" href="/link/0" />,
  );
  expect(getByTitle('Slack')).toBeInTheDocument();
});

it('renders google drive logo from properties', () => {
  const { getByTitle } = render(
    <ToolCard {...props} url="https://drive.google.com/wrong" href="/link/0" />,
  );
  expect(getByTitle('Google Drive')).toBeInTheDocument();
});

it('renders protocols from properties', () => {
  const { getByTitle } = render(
    <ToolCard {...props} url="https://protocols.io/wrong" href="/link/0" />,
  );
  expect(getByTitle('Protocols')).toBeInTheDocument();
});

it('renders default logo from properties', () => {
  const { getByTitle } = render(
    <ToolCard {...props} url="https://example.com" href="/link/0" />,
  );
  expect(getByTitle('Placeholder')).toBeInTheDocument();
});

it('renders default logo from properties on invalid url', () => {
  const { getByTitle } = render(
    <ToolCard {...props} url="example.com" href="/link/0" />,
  );
  expect(getByTitle('Placeholder')).toBeInTheDocument();
});
