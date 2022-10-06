import { TutorialsDataObject, TutorialsResponse } from '@asap-hub/model';
import { appName, baseUrl } from '../../src/config';

export const getTutorialResponse = (): TutorialsResponse =>
  getTutorialsDataObject();

export const getTutorialsDataObject = (): TutorialsDataObject => ({
  id: 'tutorial-1',
  title: 'Tutorials 1',
  shortText: 'Short text of tutorial 1',
  text: '<p>text</p>',
  thumbnail: `${baseUrl}/api/assets/${appName}/thumbnail-uuid1`,
  created: '2020-09-08T16:35:28.000Z',
});
