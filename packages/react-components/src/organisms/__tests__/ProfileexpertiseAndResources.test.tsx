import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import ProfileExpertiseAndResources from '../ProfileExpertiseAndResources';

it('renders expertiseAndResourceTags and expertise', () => {
  const { getByText, getAllByRole } = render(
    <ProfileExpertiseAndResources expertiseAndResourceTags={['a', 'b', 'c']} />,
  );
  expect(getByText('a')).toBeVisible();
  expect(getByText('b')).toBeVisible();
  expect(getByText('c')).toBeVisible();
  expect(
    getAllByRole('heading', { level: 2 }).map(({ textContent }) => textContent),
  ).toEqual(['Expertise and Resources', 'Tags']);
});

it('renders expertiseAndResourceTags and expertises with description', () => {
  const { getByText, getAllByRole } = render(
    <ProfileExpertiseAndResources
      expertiseAndResourceDescription={'description'}
      expertiseAndResourceTags={['a', 'b', 'c']}
    />,
  );

  expect(getByText('a')).toBeVisible();
  expect(getByText('b')).toBeVisible();
  expect(getByText('c')).toBeVisible();
  expect(getByText('description')).toBeVisible();
  expect(getAllByRole('heading').map(({ textContent }) => textContent)).toEqual(
    ['Expertise and Resources', 'Tags'],
  );
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

it('should not render the first section when hideExpertiseAndResources is true', () => {
  const { queryByText } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <ProfileExpertiseAndResources
        expertiseAndResourceDescription="Description that should not be rendered"
        expertiseAndResourceTags={[]}
        hideExpertiseAndResources
      />
    </UserProfileContext.Provider>,
  );

  expect(queryByText(/should not be rendered/i)).toBeNull();
});
