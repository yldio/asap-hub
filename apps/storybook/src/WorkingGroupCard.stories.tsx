import { WorkingGroupCard } from '@asap-hub/react-components';
import { boolean, text } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Network / Working Group Card',
};

export const Normal = () => (
  <WorkingGroupCard
    id="42"
    title={text('Name', 'My Group')}
    shortText={text(
      'Short text',
      'Group Short text that should be below the title and quite long to test the wrapping',
    )}
    externalLink={text('Link', 'https://www.google.com')}
    lastModifiedDate={text('Last modified date', '2020-01-1')}
    complete={boolean('Working Group Complete', true)}
  />
);
