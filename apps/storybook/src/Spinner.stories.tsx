import { Spinner } from '@asap-hub/react-components';
import { boolean, number, text } from './knobs';

export default {
  title: 'Atoms / Spinner',
  component: Spinner,
};

export const Normal = () => (
  <Spinner
    size={number('Size', 24)}
    thickness={number('Thickness', 3)}
    color={text('Color', 'rgb(77, 100, 107)')}
    trackColor={text('Track color', 'rgb(237, 241, 243)')}
    arc={boolean('Arc', false)}
    speed={text('Speed', '1s')}
  />
);

export const Arc = () => (
  <Spinner size={16} thickness={2} color="rgb(77, 100, 107)" arc speed="0.8s" />
);

export const OnDarkBackground = () => (
  <div style={{ padding: 24, background: 'rgb(77, 100, 107)' }}>
    <Spinner color="rgb(255, 255, 255)" trackColor="rgba(255, 255, 255, 0.4)" />
  </div>
);
