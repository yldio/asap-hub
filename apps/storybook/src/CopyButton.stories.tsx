import { CopyButton } from '@asap-hub/react-components';

export default {
  title: 'Atoms / CopyButton',
  component: CopyButton,
};

export const Normal = () => (
  <CopyButton
    clickTooltipText="Click Text"
    hoverTooltipText="Hover Text"
    onClick={() => {}}
  />
);
