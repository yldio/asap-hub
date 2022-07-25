import { createNewsResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import DiscoverTabs from '../DiscoverTabs';

describe('Renders the training tab', () => {
  it('renders the tutorials title and subtitle', () => {
    render(
      <DiscoverTabs
        title="Tutorials"
        subtitle="Explore our tutorials to understand how you can use the Hub and work with the tools."
        news={[
          createNewsResponse('First One', 'Tutorial'),
          createNewsResponse('Second One', 'Tutorial'),
        ]}
      />,
    );

    expect(screen.getByText(/tutorials/i, { selector: 'h2' })).toBeVisible();
    expect(screen.getByText(/Explore our tutorials/i)).toBeVisible();
  });

  it('renders tutorial items', () => {
    render(
      <DiscoverTabs
        title="Tutorials"
        subtitle="Explore our tutorials to understand how you can use the Hub and work with the tools."
        news={[
          createNewsResponse('First One', 'Tutorial'),
          createNewsResponse('Second One', 'Tutorial'),
        ]}
      />,
    );
    expect(screen.getByText(/First One/, { selector: 'h4' })).toBeVisible();
    expect(screen.getByText(/Second One/, { selector: 'h4' })).toBeVisible();
  });
});

describe('Renders the working groups tab', () => {
  it('renders the working groups title and subtitle', () => {
    render(
      <DiscoverTabs
        title="Working Groups"
        subtitle="Explore our Working Groups to learn more about what they are doing."
        news={[
          createNewsResponse('First One', 'Working Groups'),
          createNewsResponse('Second One', 'Working Groups'),
        ]}
      />,
    );

    expect(
      screen.getByText(/working groups/i, { selector: 'h2' }),
    ).toBeVisible();
    expect(screen.getByText(/Explore our Working Groups/i)).toBeVisible();
  });

  it('renders working groups items', () => {
    render(
      <DiscoverTabs
        title="Working Groups"
        subtitle="Explore our Working Groups to learn more about what they are doing."
        news={[
          createNewsResponse('First One', 'Working Groups'),
          createNewsResponse('Second One', 'Working Groups'),
        ]}
      />,
    );
    expect(screen.getByText(/First One/, { selector: 'h4' })).toBeVisible();
    expect(screen.getByText(/Second One/, { selector: 'h4' })).toBeVisible();
  });
});
