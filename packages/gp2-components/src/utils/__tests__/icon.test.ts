import {
  outputArticle,
  outputCode,
  outputDataset,
  outputForm,
  outputMaterial,
  outputReport,
  projectIcon,
  workingGroupIcon,
} from '../../icons';
import { getIconForDocumentType, getSourceIcon } from '../icon';

it('tests getIconForDocumentType return the correct icon', () => {
  expect(getIconForDocumentType('Article')).toEqual(outputArticle);
  expect(getIconForDocumentType('Code/Software')).toEqual(outputCode);
  expect(getIconForDocumentType('Dataset')).toEqual(outputDataset);
  expect(getIconForDocumentType('GP2 Reports')).toEqual(outputReport);
  expect(getIconForDocumentType('Procedural Form')).toEqual(outputForm);
  expect(getIconForDocumentType('Training Materials')).toEqual(outputMaterial);
  expect(getIconForDocumentType('')).toEqual(outputReport);
});

it('tests getSourceIcon return the correct icon', () => {
  expect(getSourceIcon('Projects')).toEqual(projectIcon);
  expect(getSourceIcon('WorkingGroups')).toEqual(workingGroupIcon);
});
