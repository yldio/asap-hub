import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import ProfileExpertiseAndResources from '../ProfileExpertiseAndResources';

it('renders expertiseAndResourceTags and expertise', () => {
  const { getByText, getByRole } = render(
    <ProfileExpertiseAndResources expertiseAndResourceTags={['a', 'b', 'c']} />,
  );
  expect(getByText('a')).toBeVisible();
  expect(getByText('b')).toBeVisible();
  expect(getByText('c')).toBeVisible();
  expect(getByRole('heading', { level: 2 }).textContent).toEqual(
    'Expertise and Resources',
  );
});

it('renders expertiseAndResourceTags and expertises with description', () => {
  const { getByText, getByRole } = render(
    <ProfileExpertiseAndResources
      expertiseAndResourceDescription={'description'}
      expertiseAndResourceTags={['a', 'b', 'c']}
    />,
  );

  expect(getByText('a')).toBeVisible();
  expect(getByText('b')).toBeVisible();
  expect(getByText('c')).toBeVisible();
  expect(getByText('description')).toBeVisible();
  expect(getByRole('heading').textContent).toEqual('Expertise and Resources');
});

it('renders description placeholder component when no description and own profile', () => {
  const { getByText, queryByText, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <ProfileExpertiseAndResources
        expertiseAndResourceDescription=""
        expertiseAndResourceTags={['test']}
      />
      ,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/you summarize/i)).toBeNull();

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <ProfileExpertiseAndResources
        expertiseAndResourceDescription=""
        expertiseAndResourceTags={['test']}
      />
      ,
    </UserProfileContext.Provider>,
  );

  expect(getByText(/you summarize/i)).toBeVisible();
});

it('renders tags placeholder component when description, no tags and own profile', () => {
  const { getByText, queryByText, rerender } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <ProfileExpertiseAndResources
        expertiseAndResourceDescription="test"
        expertiseAndResourceTags={[]}
      />
      ,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/add tags/i)).toBeNull();

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <ProfileExpertiseAndResources
        expertiseAndResourceDescription="test"
        expertiseAndResourceTags={[]}
      />
      ,
    </UserProfileContext.Provider>,
  );
  expect(getByText(/add tags/i)).toBeVisible();
});

it('is not rendered when not own profile and without expertiseAndResourceTags', () => {
  const { container } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <ProfileExpertiseAndResources
        expertiseAndResourceDescription=""
        expertiseAndResourceTags={[]}
      />
    </UserProfileContext.Provider>,
  );

  expect(container).toBeEmptyDOMElement();
});
