import { randomUUID } from 'crypto';
import { getSquidexAndContentfulClients } from './utils';

const app = async () => {
  const { contentfulEnvironment } = await getSquidexAndContentfulClients();

  const entry = await contentfulEnvironment.createEntryWithId(
    'testModel',
    randomUUID(),
    {
      fields: {
        content: getContent(),
      },
    },
  );

  await entry.publish();

  console.log(`Created entry with ID ${entry.sys.id}`);
};

const getContent = () => ({
  'en-US': {
    nodeType: 'document',
    data: {},
    content: [
      {
        data: {
          uri: 'https://aligningscienceacrossparkinsonsasap.cmail19.com/t/t-l-colrid-wuujihjhk-i/',
        },
        content: [
          {
            data: {},
            marks: [
              {
                type: 'bold',
              },
            ],
            value: 'https://hydrop.aertslab.',
            nodeType: 'text',
          },
          {
            data: {},
            content: [
              {
                data: {},
                marks: [
                  {
                    type: 'bold',
                  },
                ],
                value: '',
                nodeType: 'text',
              },
            ],
          },
          {
            data: {},
            marks: [
              {
                type: 'bold',
              },
            ],
            value: 'org/',
            nodeType: 'text',
          },
        ],
        nodeType: 'hyperlink',
      },
    ],
  },
});

app();
