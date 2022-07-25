import { createNewsResponse } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';

import DiscoverTabs, { getTitle, getSubtitle } from '../DiscoverTabs';

describe('Renders the training tab', () => {
  it('renders the tutorials title and subtitle', () => {
    render(
      <DiscoverTabs
        training={[
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
        training={[
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
        workingGroups={[
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
        workingGroups={[
          createNewsResponse('First One', 'Working Groups'),
          createNewsResponse('Second One', 'Working Groups'),
        ]}
      />,
    );
    expect(screen.getByText(/First One/, { selector: 'h4' })).toBeVisible();
    expect(screen.getByText(/Second One/, { selector: 'h4' })).toBeVisible();
  });
});

describe('tests the getTitle function', () => {
  it('returns the correct title for training', () => {
    expect(getTitle({ training: [createNewsResponse('', 'Tutorial')] })).toBe(
      'Tutorials',
    );
  });

  it('returns the correct title for working groups', () => {
    expect(
      getTitle({ workingGroups: [createNewsResponse('', 'Working Groups')] }),
    ).toBe('Working Groups');
  });
});

describe('tests the getSubtitle function', () => {
  it('returns the correct subtitle for training', () => {
    expect(
      getSubtitle({ training: [createNewsResponse('', 'Tutorial')] }),
    ).toBe(
      'Explore our tutorials to understand how you can use the Hub and work with the tools.',
    );
  });
  it('returns the correct subtitle for working groups', () => {
    expect(
      getSubtitle({
        workingGroups: [createNewsResponse('', 'Working Groups')],
      }),
    ).toBe(
      'Explore our Working Groups to learn more about what they are doing.',
    );
  });
});
