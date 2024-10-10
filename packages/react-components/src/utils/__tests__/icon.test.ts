import { getIconForDocumentType } from '../icon';
import {
  protocol,
  article,
  dataset,
  bioinformatics,
  labMaterial,
  grantDocument,
} from '../../icons';

it('tests getIconForDocumentType return the correct icon', () => {
  expect(getIconForDocumentType('Article')).toEqual(article);
  expect(getIconForDocumentType('Protocol')).toEqual(protocol);
  expect(getIconForDocumentType('Dataset')).toEqual(dataset);
  expect(getIconForDocumentType('Bioinformatics')).toEqual(bioinformatics);
  expect(getIconForDocumentType('Lab Material')).toEqual(labMaterial);
  expect(getIconForDocumentType('Grant Document')).toEqual(grantDocument);
  expect(getIconForDocumentType('Presentation')).toEqual(protocol);
  expect(getIconForDocumentType('Report')).toEqual(protocol);
});
