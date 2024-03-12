import { text, boolean } from './knobs';

import { ErrorCard } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Error Card',
  component: ErrorCard,
};

export const PlainText = () => (
  <ErrorCard
    title={text('Title', 'Something went wrong!')}
    description={text('Description', 'There was a problem with your request')}
    refreshLink={boolean('Refresh Link', false)}
    error={
      boolean('Error Included', false)
        ? new Error('Failed to get data')
        : undefined
    }
  />
);

export const ApplicationError = () => (
  <ErrorCard
    error={Object.assign(new Error(), {
      name: text('Name', 'BasicError'),
      message: text('Message', 'Failed to get data'),
    })}
    refreshLink={boolean('Refresh Link', false)}
  />
);
