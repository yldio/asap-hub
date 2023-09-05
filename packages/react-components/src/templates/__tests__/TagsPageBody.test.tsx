import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import TagsPageBody from '../TagsPageBody';

const props: ComponentProps<typeof TagsPageBody> = {
  currentPage: 0,
  numberOfItems: 1,
  numberOfPages: 1,
  renderPageHref: () => '',
  results: [],
};

it('renders no results page', () => {
  render(
    <TagsPageBody
      {...props}
      numberOfItems={0}
      numberOfPages={0}
      results={[]}
    />,
  );
  expect(screen.getByText(/Explore any tags/i)).toBeVisible();
});
it('renders a list of cards', () => {
  render(
    <TagsPageBody
      {...props}
      numberOfItems={1}
      results={[{ ...createResearchOutputResponse(), title: 'Example result' }]}
    />,
  );
  expect(screen.getByText('Example result')).toBeVisible();
});
