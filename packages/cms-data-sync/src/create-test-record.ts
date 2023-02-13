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
            data: {},
            marks: [],
            value: 'th',
            nodeType: 'text',
          },
        ],
      },
    ],
  },
});

app();
