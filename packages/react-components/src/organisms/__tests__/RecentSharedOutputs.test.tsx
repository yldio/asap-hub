import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import RecentSharedOutputs, {
  getIconForDocumentType,
} from '../RecentSharedOutputs';
import { formatDateToTimezone } from '../../date';
import {
  protocol,
  article,
  dataset,
  bioinformatics,
  labResource,
  grantDocument,
} from '../../icons';

const date = '2020-01-01';

it('renders the table research outputs', () => {
  const { getByText, getByRole, getByTitle } = render(
    <RecentSharedOutputs
      outputs={[
        {
          ...createResearchOutputResponse(),
          title: 'Test title',
          addedDate: date,
          documentType: 'Article',
        },
      ]}
    />,
  );
  expect(getByRole('link', { name: 'Test title' })).toBeVisible();
  expect(getByTitle('Article')).toBeInTheDocument();
  expect(
    getByText(formatDateToTimezone(date, 'E, d MMM y').toUpperCase()),
  ).toBeVisible();
});

it('tests getIconForDocumentType return the correct icon', () => {
  expect(getIconForDocumentType('Article')).toEqual(article);
  expect(getIconForDocumentType('Protocol')).toEqual(protocol);
  expect(getIconForDocumentType('Dataset')).toEqual(dataset);
  expect(getIconForDocumentType('Bioinformatics')).toEqual(bioinformatics);
  expect(getIconForDocumentType('Lab Resource')).toEqual(labResource);
  expect(getIconForDocumentType('Grant Document')).toEqual(grantDocument);
  expect(getIconForDocumentType('')).toEqual(protocol);
});
