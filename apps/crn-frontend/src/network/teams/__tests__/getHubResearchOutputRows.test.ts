import { TeamProductivityOpensearchDocument } from '@asap-hub/model';

import { getHubResearchOutputRows } from '../getHubResearchOutputRows';

const createDocument = (
  overrides: Partial<TeamProductivityOpensearchDocument> = {},
): TeamProductivityOpensearchDocument => ({
  id: 'team-id-1',
  name: 'Team 1',
  isInactive: false,
  Article: 0,
  Bioinformatics: 0,
  Dataset: 0,
  'Lab Material': 0,
  Protocol: 0,
  timeRange: 'all',
  outputType: 'all',
  ...overrides,
});

it('returns a row per output type in a stable order', () => {
  const rows = getHubResearchOutputRows(createDocument(), createDocument());

  expect(rows.map(({ outputType }) => outputType)).toEqual([
    'Article',
    'Bioinformatics',
    'Dataset',
    'Lab Material',
    'Protocol',
  ]);
});

it('reports the total from the all-outputs document', () => {
  const rows = getHubResearchOutputRows(
    createDocument({ Article: 4, Protocol: 10 }),
    createDocument({ outputType: 'public', Article: 2, Protocol: 5 }),
  );

  expect(rows).toEqual([
    { outputType: 'Article', numberOfOutputs: 4, publicPercentage: 50 },
    {
      outputType: 'Bioinformatics',
      numberOfOutputs: 0,
      publicPercentage: null,
    },
    { outputType: 'Dataset', numberOfOutputs: 0, publicPercentage: null },
    { outputType: 'Lab Material', numberOfOutputs: 0, publicPercentage: null },
    { outputType: 'Protocol', numberOfOutputs: 10, publicPercentage: 50 },
  ]);
});

it('rounds the percentage', () => {
  const rows = getHubResearchOutputRows(
    createDocument({ Article: 3 }),
    createDocument({ outputType: 'public', Article: 1 }),
  );

  expect(rows[0]).toEqual({
    outputType: 'Article',
    numberOfOutputs: 3,
    publicPercentage: 33,
  });
});

it('has no percentage to report when the team has no outputs of that type', () => {
  const rows = getHubResearchOutputRows(
    createDocument({ Article: 0 }),
    createDocument({ outputType: 'public', Article: 0 }),
  );

  expect(rows[0]).toEqual({
    outputType: 'Article',
    numberOfOutputs: 0,
    publicPercentage: null,
  });
});

it('falls back to zeroes when the team is missing from the index', () => {
  expect(getHubResearchOutputRows(undefined, undefined)).toEqual([
    { outputType: 'Article', numberOfOutputs: 0, publicPercentage: null },
    {
      outputType: 'Bioinformatics',
      numberOfOutputs: 0,
      publicPercentage: null,
    },
    { outputType: 'Dataset', numberOfOutputs: 0, publicPercentage: null },
    { outputType: 'Lab Material', numberOfOutputs: 0, publicPercentage: null },
    { outputType: 'Protocol', numberOfOutputs: 0, publicPercentage: null },
  ]);
});
