import { TutorialsDataObject, TutorialsResponse } from '@asap-hub/model';
import { FetchTutorialByIdQuery } from '@asap-hub/contentful';
import { appName, baseUrl } from '../../src/config';

export const getTutorialResponse = (): TutorialsResponse =>
  getTutorialsDataObject();

export const getTutorialsDataObject = (): TutorialsDataObject => ({
  id: 'tutorial-1',
  title: 'Tutorial 1',
  shortText: 'Short text of tutorial 1',
  text: '<p>text</p>',
  link: 'https://parkinsonsroadmap.org/#',
  linkText: 'ASAP',
  thumbnail: `${baseUrl}/api/assets/${appName}/thumbnail-uuid1`,
  created: '2020-09-08T16:35:28.000Z',
});

export const getContentfulGraphqlTutorial = (): NonNullable<
  FetchTutorialByIdQuery['tutorials']
> => {
  return {
    sys: {
      id: 'tutorial-1',
    },
    publishDate: '2020-09-08T16:35:28.000Z',
    title: 'Tutorial 1',
    shortText: 'Short text of tutorial 1',
    text: {
      json: {
        nodeType: 'document',
        data: {},
        content: [
          {
            nodeType: 'paragraph',
            data: {},
            content: [{ nodeType: 'text', value: 'text', marks: [], data: {} }],
          },
        ],
      },
      links: {
        entries: {
          inline: [],
        },
        assets: {
          block: [],
        },
      },
    },
    link: 'https://parkinsonsroadmap.org/#',
    linkText: 'ASAP',
    thumbnail: {
      url: `${baseUrl}/api/assets/${appName}/thumbnail-uuid1`,
    },
  };
};
