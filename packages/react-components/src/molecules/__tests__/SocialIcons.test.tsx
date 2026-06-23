import { render } from '@testing-library/react';

import SocialIcons from '../SocialIcons';

it('renders icon and link', () => {
  const { queryAllByRole } = render(
    <SocialIcons
      blueSky="test"
      github="test"
      linkedIn="test"
      orcid="test"
      researcherId="test"
      twitter="test"
      googleScholar="test"
      researchGate="test"
      website1="http://example.com/website1"
      website2="http://example.com/website2"
    />,
  );
  expect(
    queryAllByRole('link').map((link) => [
      link.getElementsByTagName('title')[0]!.innerHTML,
      link.getAttribute('href'),
    ]),
  ).toMatchInlineSnapshot(`
    [
      [
        "ORCID",
        "https://orcid.org/test",
      ],
      [
        "ResearcherID",
        "https://publons.com/researcher/test",
      ],
      [
        "Blue Sky",
        "https://bsky.app/profile/test",
      ],
      [
        "Twitter",
        "https://twitter.com/test",
      ],
      [
        "GitHub",
        "https://github.com/test",
      ],
      [
        "Google Scholar",
        "https://scholar.google.co.uk/citations?user=test",
      ],
      [
        "Research Gate",
        "https://www.researchgate.net/profile/test",
      ],
      [
        "LinkedIn",
        "https://www.linkedin.com/in/test",
      ],
      [
        "Website",
        "http://example.com/website1",
      ],
      [
        "Website",
        "http://example.com/website2",
      ],
    ]
  `);
});

it('does not contain content when there are no social icons', () => {
  const { container } = render(<SocialIcons />);
  expect(container.firstChild).toBeEmptyDOMElement();
});

it('renders only defined social icons', () => {
  const { queryAllByRole, queryByTitle } = render(
    <SocialIcons github="test" />,
  );
  expect(queryAllByRole('link')).toHaveLength(1);
  expect(queryByTitle('GitHub')).toBeInTheDocument();
  expect(queryByTitle('Research Gate')).not.toBeInTheDocument();
});
