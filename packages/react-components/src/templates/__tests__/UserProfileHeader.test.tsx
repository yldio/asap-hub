import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';
import { UserProfileContext } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';

import UserProfileHeader from '../UserProfileHeader';

const boilerplateProps: ComponentProps<typeof UserProfileHeader> = {
  ...createUserResponse(),
  role: 'Grantee',
  sharedOutputsCount: 0,
};

it('renders the name as the top-level heading', () => {
  render(
    <UserProfileHeader {...boilerplateProps} fullDisplayName="John Doe" />,
  );
  expect(screen.getByRole('heading')).toHaveTextContent('John Doe');
  expect(screen.getByRole('heading').tagName).toBe('H1');
});

it('generates the mailto link', () => {
  const { getByText } = render(
    <UserProfileHeader {...boilerplateProps} email="me@example.com" />,
  );
  expect(getByText(/contact/i).closest('a')).toHaveAttribute(
    'href',
    'mailto:me@example.com',
  );
});
it('prefers an explicit contact email address', () => {
  const { getByText } = render(
    <UserProfileHeader
      {...boilerplateProps}
      contactEmail="contact@example.com"
    />,
  );
  expect(getByText(/contact/i).closest('a')).toHaveAttribute(
    'href',
    'mailto:contact@example.com',
  );
});
it('copy button adds email to clipboard', async () => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(),
    },
  });
  jest.spyOn(navigator.clipboard, 'writeText');
  render(<UserProfileHeader {...boilerplateProps} email="me@example.com" />);
  const copyButton = screen.getByRole('button', { name: 'Copy' });
  expect(copyButton).toBeVisible();
  userEvent.click(copyButton);
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('me@example.com');
});
describe('an edit button', () => {
  it('is not rendered by default', () => {
    const { queryByLabelText } = render(
      <UserProfileHeader {...boilerplateProps} />,
    );
    expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });

  it('is rendered for personal info', () => {
    const { getByLabelText } = render(
      <UserProfileHeader
        {...boilerplateProps}
        editPersonalInfoHref="/edit-personal-info"
      />,
    );
    expect(getByLabelText(/edit.+personal/i)).toHaveAttribute(
      'href',
      '/edit-personal-info',
    );
  });

  it('is rendered for contact info', () => {
    const { getByLabelText } = render(
      <UserProfileHeader
        {...boilerplateProps}
        editContactInfoHref="/edit-contact-info"
      />,
    );
    expect(getByLabelText(/edit.+contact/i)).toHaveAttribute(
      'href',
      '/edit-contact-info',
    );
  });

  it('is rendered for avatar', () => {
    const onImageSelect = jest.fn((file: File) => {});
    const testFile = new File(['foo'], 'foo.png', { type: 'image/png' });
    const { getByLabelText } = render(
      <UserProfileHeader {...boilerplateProps} onImageSelect={onImageSelect} />,
    );
    const editButton = getByLabelText(/edit.+avatar/i);
    const uploadInput = getByLabelText(/upload.+avatar/i);
    expect(editButton).toBeVisible();
    expect(uploadInput).not.toHaveAttribute('disabled');
    userEvent.upload(uploadInput, testFile);
    expect(onImageSelect).toHaveBeenCalledWith(testFile);
  });
});

it('shows placeholder text for degree on own profile when omitted', () => {
  const { queryByText, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <UserProfileHeader {...boilerplateProps} degree={undefined} />,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/degree/i)).toBeNull();
  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} degree={undefined} />,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/degree/i)).toBeVisible();
  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} degree="BA" />,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/, BA/i)).toBeVisible();
});

describe('alumni', () => {
  it('shows the alumni badge when user is alumni', () => {
    const { queryByText, queryByTitle, rerender } = render(
      <UserProfileContext.Provider value={{ isOwnProfile: false }}>
        <UserProfileHeader
          {...boilerplateProps}
          alumniSinceDate={new Date().toISOString()}
          degree={undefined}
        />
        ,
      </UserProfileContext.Provider>,
    );
    expect(queryByText('Alumni')).toBeInTheDocument();
    expect(queryByTitle('Alumni Member')).toBeInTheDocument();

    rerender(
      <UserProfileContext.Provider value={{ isOwnProfile: false }}>
        <UserProfileHeader {...boilerplateProps} degree={undefined} />,
      </UserProfileContext.Provider>,
    );
    expect(queryByText('Alumni')).not.toBeInTheDocument();
    expect(queryByTitle('Alumni Member')).not.toBeInTheDocument();
  });

  it('shows the proper alumni toast message when user is alumni', () => {
    const { queryByText, rerender } = render(
      <UserProfileContext.Provider value={{ isOwnProfile: false }}>
        <UserProfileHeader
          {...boilerplateProps}
          alumniSinceDate={new Date('2022-09-12T12:00:00').toISOString()}
          lastModifiedDate={new Date('2021-09-01T12:00:00').toISOString()}
          degree={undefined}
        />
        ,
      </UserProfileContext.Provider>,
    );
    expect(
      queryByText(
        'This alumni might not have all content updated or available.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    rerender(
      <UserProfileContext.Provider value={{ isOwnProfile: false }}>
        <UserProfileHeader
          {...boilerplateProps}
          alumniSinceDate={new Date('2022-09-12T12:00:00').toISOString()}
          lastModifiedDate={new Date('2021-09-01T12:00:00').toISOString()}
          alumniLocation={'Some University'}
          degree={undefined}
        />
        ,
      </UserProfileContext.Provider>,
    );
    expect(
      queryByText('and their role is now at', {
        exact: false,
      }),
    ).toBeInTheDocument();
  });
});

it('shows lab information if the user is in a lab', async () => {
  const { container, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} labs={[]} />,
    </UserProfileContext.Provider>,
  );
  expect(container).not.toHaveTextContent('Lab');

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader
        {...boilerplateProps}
        labs={[
          { name: 'Brighton', id: '1' },
          { name: 'Liverpool', id: '2' },
        ]}
      />
      ,
    </UserProfileContext.Provider>,
  );
  expect(container).toHaveTextContent('Brighton Lab and Liverpool Lab');
});

it('displays number of shared research', async () => {
  render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileHeader {...boilerplateProps} sharedOutputsCount={5} />,
    </UserProfileContext.Provider>,
  );
  expect(screen.getByText('Shared Outputs (5)')).toBeInTheDocument();
});

it('renders the navigation for active and inactive groups', () => {
  render(
    <UserProfileHeader
      {...boilerplateProps}
      pastEventsCount={1}
      upcomingEventsCount={1}
    />,
  );

  expect(
    screen.getAllByRole('listitem').map(({ textContent }) => textContent),
  ).toStrictEqual([
    'Research',
    'Background',
    'Shared Outputs (0)',
    'Upcoming Events (1)',
    'Past Events (1)',
  ]);
});

it('displays number of upcoming events', () => {
  render(
    <StaticRouter
      location={network({}).users({}).user({ userId: '1' }).upcoming({}).$}
    >
      <UserProfileHeader {...boilerplateProps} upcomingEventsCount={10} />
    </StaticRouter>,
  );
  expect(screen.queryByText('Upcoming Events (10)')).toBeInTheDocument();
});

it('displays number of past events', () => {
  render(
    <StaticRouter
      location={network({}).users({}).user({ userId: '1' }).upcoming({}).$}
    >
      <UserProfileHeader {...boilerplateProps} pastEventsCount={9} />
    </StaticRouter>,
  );
  expect(screen.queryByText('Past Events (9)')).toBeInTheDocument();
});
