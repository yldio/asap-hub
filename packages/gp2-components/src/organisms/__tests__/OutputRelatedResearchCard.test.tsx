import {
  outputArticle,
  outputCode,
  outputDataset,
  outputForm,
  outputMaterial,
  outputReport,
} from '../../icons';
import { getIconForDocumentType } from '../OutputRelatedResearchCard';

it('tests getIconForDocumentType return the correct icon', () => {
  expect(getIconForDocumentType('Article')).toEqual(outputArticle);
  expect(getIconForDocumentType('Code/Software')).toEqual(outputCode);
  expect(getIconForDocumentType('Dataset')).toEqual(outputDataset);
  expect(getIconForDocumentType('GP2 Reports')).toEqual(outputReport);
  expect(getIconForDocumentType('Procedural Form')).toEqual(outputForm);
  expect(getIconForDocumentType('Training Materials')).toEqual(outputMaterial);
  expect(getIconForDocumentType('')).toEqual(outputReport);
});
