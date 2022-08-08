import { ImageLink, Avatar, asapImage } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / ImageLink',
  component: ImageLink,
};

export const WithPlaceholderAvatar = () => (
  <ImageLink
    placeholder={
      <Avatar
        border={false}
        imageUrl={text(
          'Image URL',
          'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
        )}
      />
    }
    link={text('Link', 'user-1')}
  />
);

export const WithImage = () => (
  <ImageLink
    imgSrc={asapImage}
    containerPropStyle={{ width: '100%', display: 'flex', flexFlow: 'column' }}
    link={text('Link', 'user-2')}
  />
);

export const WithoutLink = () => (
  <ImageLink
    imgSrc={asapImage}
    containerPropStyle={{ width: '100%', display: 'flex', flexFlow: 'column' }}
  />
);
