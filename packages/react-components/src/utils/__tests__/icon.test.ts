import { getIconForDocumentType } from '../icon';
import {
  protocol,
  article,
  dataset,
  bioinformatics,
  labResource,
  grantDocument,
} from '../../icons';

it('tests getIconForDocumentType return the correct icon', () => {
  expect(getIconForDocumentType('Article')).toEqual(article);
  expect(getIconForDocumentType('Protocol')).toEqual(protocol);
  expect(getIconForDocumentType('Dataset')).toEqual(dataset);
  expect(getIconForDocumentType('Bioinformatics')).toEqual(bioinformatics);
  expect(getIconForDocumentType('Lab Resource')).toEqual(labResource);
  expect(getIconForDocumentType('Grant Document')).toEqual(grantDocument);
  expect(getIconForDocumentType('')).toEqual(protocol);
});
