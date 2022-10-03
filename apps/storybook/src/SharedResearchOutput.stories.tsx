import { ComponentProps } from 'react';
import { SharedResearchOutput } from '@asap-hub/react-components';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';

import {
  text,
  date,
  array,
  number,
  select,
  boolean,
} from '@storybook/addon-knobs';

import {
  createLabs,
  createListTeamResponse,
  createListUserResponse,
  createResearchOutputResponse,
} from '@asap-hub/fixtures';
import {
  ExternalAuthorResponse,
  ResearchOutputSharingStatus,
} from '@asap-hub/model';

export default {
  title: 'Templates / Shared Research / Details',
};

const props = (): ComponentProps<typeof SharedResearchOutput> => ({
  ...createResearchOutputResponse(),
  documentType: 'Article',
  title: text(
    'Title',
    'Molecular actions of PD-associated pathological proteins using in vitro human pluripotent stem cell-derived brain',
  ),
  link: text('Link', 'http://example.com'),
  tags: array('Tags', ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5']),
  usageNotes: text(
    'Access Instructions',
    'If you need many people to view a file at once, publish it and create a link to share to viewers. You can give edit access to people who need to edit or comment. Up to 100 people with view, edit, or comment permissions can work at the same time. When more than 100 people are accessing a file, only the owner and some users with editing permissions can edit the file.',
  ),
  sharingStatus: select<ResearchOutputSharingStatus>(
    'Sharing Status',
    ['Public', 'Network Only'],
    'Public',
  ),
  asapFunded: select<boolean | undefined>(
    'ASAP-funded',
    { Unknown: undefined, Yes: true, No: false },
    undefined,
  ),
  usedInPublication: select<boolean | undefined>(
    'Used in a publication',
    { Unknown: undefined, Yes: true, No: false },
    undefined,
  ),
  doi: text('DOI', '10.1101/gr.10.12.1841'),
  rrid: text('RRID', 'RRID:SCR_007358'),
  accession: text('Accession #', 'NC_000001.11'),
  labCatalogNumber: text('Lab Catalog Number', 'https://example.com'),
  addedDate: new Date(
    date('Added Date', new Date(2020, 3, 10, 10, 54)),
  ).toISOString(),
  lastUpdatedPartial: new Date(
    date('Last Updated Date', new Date(2020, 6, 12, 14, 32)),
  ).toISOString(),
  backHref: '#',
  teams: createListTeamResponse(number('Number of teams', 3)).items,
  contactEmails: boolean('Show Contact CTA', true)
    ? ['example@example.com']
    : [],
  authors: [
    ...createListUserResponse(number('Number of authors', 2)).items,
    ...Array.from({ length: number('Number of external authors', 1) }).map(
      (_, i): ExternalAuthorResponse => ({
        id: `external-author-${i + 1}`,
        displayName: `External Author ${i + 1}`,
        alumniSinceDate:
          i % 2 === 0
            ? new Date(
                date('Alumni Since Date', new Date(2021, 6, 12, 14, 32)),
              ).toISOString()
            : undefined,
      }),
    ),
  ],
  labs: createLabs({ labs: number('Number of labs', 2) }),
});

export const Normal = () => (
  <ResearchOutputPermissionsContext.Provider
    value={{ canCreateUpdate: boolean('Can Edit', false) }}
  >
    <SharedResearchOutput
      {...props()}
      description={text(
        'Description',
        `Neural control of muscle function is fundamental to animal behavior. In many cases, specific muscles can generate multiple distinct behaviors. Nonetheless, individual muscle cells are generally regarded as the smallest units of motor control. Here we report that muscle cells can alter their behavioral output by contracting subcellularly.
    <b>Bold Text</b> <a href="http://example.com"> link </a>
    `,
      )}
    />
  </ResearchOutputPermissionsContext.Provider>
);
export const GrantDocument = () => (
  <ResearchOutputPermissionsContext.Provider
    value={{ canCreateUpdate: boolean('Can Edit', false) }}
  >
    <SharedResearchOutput
      {...props()}
      documentType="Grant Document"
      description={text(
        'Description',
        `<h1>Example</h1>
      Neural control of muscle function is fundamental to animal behavior. In many cases, specific muscles can generate multiple distinct behaviors. Nonetheless, individual muscle cells are generally regarded as the smallest units of motor control. Here we report that muscle cells can alter their behavioral output by contracting subcellularly.
      <h2>Example 2</h2>
      <b>Bold Text</b> <a href="http://example.com"> link </a>
    `,
      )}
    />
  </ResearchOutputPermissionsContext.Provider>
);
