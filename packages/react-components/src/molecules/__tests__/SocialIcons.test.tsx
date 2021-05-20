import { render } from '@testing-library/react';
import { UserProfileContext } from '@asap-hub/react-context';

import SocialIcons from '../SocialIcons';

it('renders icon and link', () => {
  const { queryAllByRole } = render(
    <SocialIcons
      github="test"
      linkedIn="test"
      orcid="test"
      researcherId="test"
      twitter="test"
      googleScholar="test"
      researchGate="test"
    />,
  );
  expect(
    queryAllByRole('link').map((link) => [
      link.getElementsByTagName('title')[0].innerHTML,
      link.getAttribute('href'),
    ]),
  ).toMatchInlineSnapshot(`
    Array [
      Array [
        "ORCID",
        "https://orcid.org/test",
      ],
      Array [
        "ResearcherID",
        "https://publons.com/researcher/test",
      ],
      Array [
        "Twitter",
        "https://twitter.com/test",
      ],
      Array [
        "GitHub",
        "https://github.com/test",
      ],
      Array [
        "Google Scholar",
        "https://scholar.google.co.uk/citations?user=test",
      ],
      Array [
        "Research Gate",
        "https://www.researchgate.net/profile/test",
      ],
      Array [
        "LinkedIn",
        "https://www.linkedin.com/in/test",
      ],
    ]
  `);
});

it('does not contain content when there are no social icons', () => {
  const { container } = render(<SocialIcons />);
  expect(container.firstChild).toBeEmptyDOMElement();
});

it('renders social icons without links for own profile', () => {
  const { getByTitle } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <SocialIcons />
    </UserProfileContext.Provider>,
  );
  const element = getByTitle('Research Gate');
  expect(element).toBeInTheDocument();
  expect(element.closest('a')).not.toHaveAttribute('href');
});
