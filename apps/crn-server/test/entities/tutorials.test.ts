import { appName, baseUrl } from '../../src/config';
import { parseGraphQLTutorials } from '../../src/entities';

describe('parse GraphQL tutorials entities', () => {
  test.each`
    description       | thumbnail           | expected
    ${'no thumbnail'} | ${undefined}        | ${undefined}
    ${'thumbnail'}    | ${[{ id: 'uuid' }]} | ${`${baseUrl}/api/assets/${appName}/uuid`}
  `('parse handles $description', async ({ thumbnail, expected }) => {
    const date = new Date().toISOString();
    const tutorials = {
      id: 'uuid',
      created: date,
      flatData: {
        title: 'Title',
        shortText: 'shortText',
        thumbnail,
        text: 'text',
        link: 'http://a.link',
        linkText: 'Link text',
      },
    };

    expect(parseGraphQLTutorials(tutorials)).toMatchObject({
      id: 'uuid',
      created: date,
      title: 'Title',
      shortText: 'shortText',
      text: 'text',
      thumbnail: expected,
    });
  });
  test.each`
    description    | field          | expected
    ${'undefined'} | ${'link'}      | ${undefined}
    ${'undefined'} | ${'linkText'}  | ${undefined}
    ${'undefined'} | ${'text'}      | ${undefined}
    ${'undefined'} | ${'title'}     | ${''}
    ${'undefined'} | ${'shortText'} | ${''}
  `('parse handles $description $field', async ({ field, expected }) => {
    const date = new Date().toISOString();
    const tutorials = {
      id: 'uuid',
      created: date,
      flatData: {
        title: 'Title',
        shortText: 'shortText',
        thumbnail: [{ id: 'uuid' }],
        text: 'text',
        link: 'http://a.link',
        linkText: 'Link text',
      },
    };

    const expectedParsedTutorial = {
      id: 'uuid',
      created: date,
      title: 'Title',
      shortText: 'shortText',
      text: 'text',
      thumbnail: `${baseUrl}/api/assets/${appName}/uuid`,
    };

    expect(
      parseGraphQLTutorials({
        ...tutorials,
        flatData: { ...tutorials.flatData, [field]: undefined },
      }),
    ).toMatchObject({
      ...expectedParsedTutorial,
      [field]: expected,
    });
  });
});
