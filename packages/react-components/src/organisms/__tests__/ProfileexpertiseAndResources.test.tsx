import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import ProfileExpertiseAndResources from '../ProfileExpertiseAndResources';

const mapTags = (tags: string[]) => tags.map((tag) => ({ name: tag, id: tag }));

it('renders tags and expertise', () => {
  const { getByText, getAllByRole } = render(
    <ProfileExpertiseAndResources tags={mapTags(['a', 'b', 'c'])} />,
  );
  expect(getByText('a')).toBeVisible();
  expect(getByText('b')).toBeVisible();
  expect(getByText('c')).toBeVisible();
  expect(
    getAllByRole('heading', { level: 2 }).map(({ textContent }) => textContent),
  ).toEqual(['Expertise and Resources', 'Tags']);
});

it('renders tags and expertises with description', () => {
  const { getByText, getAllByRole } = render(
    <ProfileExpertiseAndResources
      expertiseAndResourceDescription={'description'}
      tags={mapTags(['a', 'b', 'c'])}
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
        tags={mapTags(['test'])}
      />
      ,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/you summarize/i)).toBeNull();

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <ProfileExpertiseAndResources
        expertiseAndResourceDescription=""
        tags={mapTags(['test'])}
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
        tags={[]}
      />
      ,
    </UserProfileContext.Provider>,
  );
  expect(queryByText(/add tags/i)).toBeNull();

  rerender(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <ProfileExpertiseAndResources
        expertiseAndResourceDescription="test"
        tags={mapTags([])}
      />
      ,
    </UserProfileContext.Provider>,
  );
  expect(getByText(/add tags/i)).toBeVisible();
});

it('is not rendered when not own profile and without tags', () => {
  const { container } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: false }}>
      <ProfileExpertiseAndResources
        expertiseAndResourceDescription=""
        tags={[]}
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
        tags={[]}
        hideExpertiseAndResources
      />
    </UserProfileContext.Provider>,
  );

  expect(queryByText(/should not be rendered/i)).toBeNull();
});
