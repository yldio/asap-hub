import { Overlay } from '@asap-hub/react-components';
import { boolean } from '@storybook/addon-knobs';
import { NoPaddingDecorator } from './layout';

export default {
  title: 'Atoms / Overlay',
  component: Overlay,
  decorators: [NoPaddingDecorator],
};

export const Normal = () => <Overlay shown={boolean('Shown', true)} />;
