import { ImageLink, Avatar, asapImage } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / ImageLink',
  component: ImageLink,
};

export const WithPlaceholderAvatar = () => (
  <ImageLink link={text('Link', 'user-1')}>
    <Avatar
      border={false}
      imageUrl={text(
        'Image URL',
        'https://www.hhmi.org/sites/default/files/styles/epsa_250_250/public/Programs/Investigator/Randy-Schekman-400x400.jpg',
      )}
    />
  </ImageLink>
);

export const WithImage = () => (
  <div style={{ width: '100%', display: 'flex', flexFlow: 'column' }}>
    <ImageLink link={text('Link', 'user-2')}>
      <img src={asapImage} alt="asap" />
    </ImageLink>
  </div>
);
