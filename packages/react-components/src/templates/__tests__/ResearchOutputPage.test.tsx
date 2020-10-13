import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ResearchOutputPage from '../ResearchOutputPage';

const props: ComponentProps<typeof ResearchOutputPage> = {
  libraryHref: '#',
  profileHref: '#',
  title: 'title',
  type: 'proposal',
  created: '2020-06-25T15:00:47.920Z',
  text: 'content',
};
it('renders a proposal title and content', () => {
  const { getByText } = render(
    <ResearchOutputPage
      {...props}
      type="proposal"
      title="title"
      text="content"
    />,
  );
  expect(getByText(/proposal/i)).toBeVisible();
  expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
  expect(getByText(/content/i)).toBeVisible();
});

it('renders a proposal with team information', () => {
  const { getByText } = render(
    <ResearchOutputPage
      {...props}
      team={{
        id: '1',
        displayName: 'Test',
        href: '#',
      }}
    />,
  );
  const element = getByText('Team Test') as HTMLAnchorElement;
  expect(element).toBeVisible();
  expect(element.href).toEqual('http://localhost/#');
});
