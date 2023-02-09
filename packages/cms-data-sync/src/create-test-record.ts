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
        data: {},
        content: [
          {
            data: {
              uri: 'mailto:crn_times@asap.science',
            },
            content: [
              {
                data: {},
                content: [],
                nodeType: 'text',
              },

            ],
            nodeType: 'hyperlink',
          },
        ],
        nodeType: 'paragraph',
      },
    ],
  },
});

app();
