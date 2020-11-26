import React from 'react';
import { render } from '@testing-library/react';

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
        "Orcid Social",
        "https://orcid.org/test",
      ],
      Array [
        "Researcher Id",
        "https://publons.com/researcher/test",
      ],
      Array [
        "Twitter",
        "https://twitter.com/test",
      ],
      Array [
        "Github",
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
