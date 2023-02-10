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
          uri: 'https://aligningscienceacrossparkinsonsasap.cmail20.com/t/t-l-qdikktl-wuujihjhk-jh/',
        },
        content: [
          {
            data: {
              target: {
                sys: {
                  type: 'Link',
                  linkType: 'Asset',
                  id: '512766340',
                },
              },
            },
            content: [],
            nodeType: 'embedded-asset-block',
          },
        ],
        nodeType: 'hyperlink',
      },
    ],
  },
});

app();
