import { TeamOutputDocumentTypeParameter } from '@asap-hub/routing';
import { ResearchOutputDocumentType } from '@asap-hub/model';

import { paramOutputDocumentTypeToResearchOutputDocumentType } from '../shared-research';

it.each<{
  param: Parameters<
    typeof paramOutputDocumentTypeToResearchOutputDocumentType
  >[0];
  outputType: ResearchOutputDocumentType;
}>([
  { param: 'article', outputType: 'Article' },
  { param: 'bioinformatics', outputType: 'Bioinformatics' },
  { param: 'dataset', outputType: 'Dataset' },
  { param: 'lab-resource', outputType: 'Lab Resource' },
  { param: 'protocol', outputType: 'Protocol' },
  { param: 'protocol', outputType: 'Protocol' },
  { param: 'report', outputType: 'Report' },
  {
    param: 'unknown' as TeamOutputDocumentTypeParameter,
    outputType: 'Article',
  },
])('maps from $param to $outputType', ({ param, outputType }) => {
  expect(paramOutputDocumentTypeToResearchOutputDocumentType(param)).toEqual(
    outputType,
  );
});
